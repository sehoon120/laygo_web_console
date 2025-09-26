#Webconsole에서 실행할 예시 스크립트


#########################################################
#                                                        
# Inverter Layout Generator              
# Contributors: T. Shin, S. Park, Y. Oh, T. Kang     
# Last Updated: 2024-09-16               
#                                                        
#########################################################


import numpy as np
import laygo2
import laygo2_tech as tech

# Parameter definitions #############
# Design Variables
nf_list = [2, 4, 6, 8]

# Templates
tpmos_name = 'pmos'
tnmos_name = 'nmos'
tntap_name = 'ntap'
tptap_name = 'ptap'

# Grids
pg_name = 'placement_basic'
r12_name = 'routing_12_cmos'
r23_name = 'routing_23_cmos'

# Design hierarchy
libname = 'test_logic'
# Layout generation path is set to "export_path/libname/cellname".
export_path = '/templates/' 
# SKILL file generation path is set to "export_path_skill/libname_cellname.il"
#export_path_skill = export_path+'skill/' 
# End of parameter definitions ######

# Generation start ##################
# 1. Load templates and grids.
print("Load templates")
templates = tech.load_templates()
tpmos, tnmos = templates[tpmos_name], templates[tnmos_name]
tntap, tptap = templates[tntap_name], templates[tptap_name]
# Uncomment the following line if you use the logic templates in the generator code.
tlib = laygo2.import_template(filename=export_path+'test_logic_templates.yaml', username = 'jeyunp') 
# Uncomment if you want to print template information.
# print(templates[tpmos_name], templates[tnmos_name], sep="\n") 

print("Load grids")
grids = tech.load_grids(templates=templates)
pg, r12, r23 = grids[pg_name], grids[r12_name], grids[r23_name]
# Uncomment if you want to print grid information.
# print(grids[pg_name], grids[r12_name], grids[r23_name], sep="\n") 

for nf in nf_list:
    cellname = f'inv_{nf}x'
    print('--------------------')
    print(f'Creating {cellname}')

    # 2. Create a design hierarchy
    lib = laygo2.Library(name=libname)
    dsn = laygo2.Design(name=cellname, libname=libname)
    lib.append(dsn)
    
    # 3. Create instances.
    print("Create instances")
    in0  = tnmos.generate(name='MN0',                 params={'nf': nf, 'tie': 'S'})
    ip0  = tpmos.generate(name='MP0', transform='MX', params={'nf': nf, 'tie': 'S'})
    
    # 4. Place instances.
    dsn.place(grid=pg, inst=[[in0], [ip0]], mn=[0,0])
    
    # 5. Create and place wires.
    print("Create wires")

    # IN
    _track = [r23(in0.p['G'])[0,0]-1, None]
    rin0 = dsn.route(grid=r23, mn=[in0.p['G'], ip0.p['G']], track=_track)
    rin0 = rin0[-1] # the last element corresponds to the trunk wire
    
    # OUT
    _mn = [r23.right(in0.p['D']), r23.right(ip0.p['D'])]
    _, rout0, _ = dsn.route(grid=r23, mn=_mn, via_tag=[True, True])
    
    # Rails
    tech.generate_pwr_rail(dsn, grids, netname=['VSS', 'VDD'], vertical=False)
    
    # 6. Create pins.
    pin0 = dsn.pin(name='I', grid=r23, mn=rin0)
    pout0 = dsn.pin(name='O', grid=r23, mn=rout0)
    
    # 7. Export to physical database.
    print("Export design\n")
    laygo2.export(lib, tech=tech, filename = 'jeyunp/test', target='webconsole')
    # Filename example: ./laygo2_generators_private/logic/skill/logic_generated_inv_hs_2x.il
    
    # 8. Export to a template database file.
    nat_temp = dsn.export_to_template()
    laygo2.export_template(nat_temp, filename=f"{export_path}{libname}_templates.yaml", mode='append', username='jeyunp')
    # Filename example: ./laygo2_generators_private/logic/logic_generated_templates.yaml