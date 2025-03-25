import numpy as np
import laygo2
import laygo2_tech as tech


# Design Variables
cell_type = 'xor'
nf = 2

# Design hierarchy
libname = 'logic_generated'
cellname = cell_type+'_'+str(nf)+'x'

# Templates
templates = tech.load_templates()
export_path = '/WORK_jupiter/shchon/training/bag_workspace_gpdk045/'
tlib = laygo2.interface.yaml.import_template(filename = export_path+'logic_generated_templates.yaml')

tpmos_name = 'pmos'
tnmos_name = 'nmos'
templates = tech.load_templates()
tpmos, tnmos = templates[tpmos_name], templates[tnmos_name]

# Grids
pg_name = 'placement_basic'
r12_name = 'routing_12_cmos'
r23_name = 'routing_23_cmos'
r34_name = 'routing_34_basic'

grids = tech.load_grids(templates=templates)
pg, r12, r23, r34 = grids[pg_name], grids[r12_name], grids[r23_name], grids[r34_name]

# Create a design hierarchy
lib = laygo2.object.database.Library(name=libname)
dsn = laygo2.object.database.Design(name=cellname, libname=libname)
lib.append(dsn)


in0 = tnmos.generate(name='in0',                 params={'nf': nf, 'tie': 'S'})  #
in1 = tnmos.generate(name='in1',                 params={'nf': nf, 'tie': 'S'})  #
in2 = tnmos.generate(name='in2',                 params={'nf': nf, 'tie': 'S'})  #
in3 = tnmos.generate(name='in3',                 params={'nf': nf, 'tie': 'S'})  #

in4 = tnmos.generate(name='in4',                 params={'nf': nf, 'tie': 'S'})  # inverter
in5 = tnmos.generate(name='in5',                 params={'nf': nf, 'tie': 'S'})  #

ip0 = tpmos.generate(name='ip0', params={'nf': nf, 'tie': 'S'})  #
ip1 = tpmos.generate(name='ip1', params={'nf': nf, 'tie': 'S'})  #
ip2 = tpmos.generate(name='ip2', params={'nf': nf, 'tie': 'S'})  # 
ip3 = tpmos.generate(name='ip3', params={'nf': nf, 'tie': 'S'})  # 

ip4 = tpmos.generate(name='ip4', params={'nf': nf, 'tie': 'S'})  # inverter
ip5 = tpmos.generate(name='ip5', params={'nf': nf, 'tie': 'S'})  # 

# Place Instances
dsn.place(grid=pg, inst=[[in4, in0, in1, in2, in3, in5, ip4, ip0, ip1, ip2, ip3, ip5]], mn=[0, 0])



# IN
# A
_mn = [r23(in4.p['G'])[0], r23(ip4.p['G'])[0]]# in4  ip4
_track = [r23(in4.p['G'])[0, 0]-1,None]
inA1 = dsn.route_via_track(grid=r23, mn=_mn, track=_track)
inA1 = inA1[-1]    # A

ds0 = r23(in1.p['G'])[0]
ds1 = r23(ip2.p['G'])[0]
_mn = [[ds0[0]+1, ds0[1]], [ds0[0]+1, ds0[1]+1], [ds1[0]-1, ds0[1]+1], [ds1[0]-1, ds1[1]]]  # in1  ip2
inA2 = dsn.route(grid=r23, mn=_mn, via_tag=[True, None, None, True])
# inA2 = inA2[5]
_mn = [ds0, [ds0[0]+1, ds0[1]]]
inA3 = dsn.route(grid=r12, mn=_mn, via_tag=[True, True])
_mn = [[ds1[0]-1, ds1[1]], ds1]
inA4 = dsn.route(grid=r12, mn=_mn, via_tag=[True, True])
_mn = [[r23(in4.p['G'])[0,0]-1, r23(in4.p['G'])[0,1]+1], [ds0[0]+1, ds0[1]+1]]
inA5 = dsn.route(grid=r12, mn=_mn, via_tag=[True, True])

# B
_mn = [r23(in5.p['G'])[0], r23(ip5.p['G'])[0]]  # in5  ip5
_track = [r23(in5.p['G'])[0, 0]+1,None]
inB1 = dsn.route_via_track(grid=r23, mn=_mn, track=_track)
inB1 = inB1[-1]    # B

ds0 = r23(in0.p['G'])[0]
ds1 = r23(ip1.p['G'])[0]
_mn = [[ds0[0]+1, ds0[1]], [ds0[0]+1, ds0[1]+1], [ds1[0]-1, ds0[1]+1], [ds1[0]-1, ds1[1]], [ds1[0]-1, ds1[1]+2]]  # in0  ip1
inB2 = dsn.route(grid=r23, mn=_mn, via_tag=[True, None, None, True, True])
# inB2 = inB2[5]
_mn = [[r23(ip5.p['G'])[0,0]+1, r23(ip5.p['G'])[0,1]], [r23(ip5.p['G'])[0,0]+1, r23(ip5.p['G'])[0,1]+2]]
inB3 = dsn.route(grid=r23, mn=_mn, via_tag=[True, True])
# inB3 = inB2[5]
_mn = [ds0, [ds0[0]+1, ds0[1]]]
inB4 = dsn.route(grid=r12, mn=_mn, via_tag=[True, True])
_mn = [[ds1[0]-1, ds1[1]], ds1]
inB5 = dsn.route(grid=r12, mn=_mn, via_tag=[True, True])
_mn = [[ds1[0]-1, ds1[1]+2], [r23(ip5.p['G'])[0,0]+1, ds1[1]+2]]
inA5 = dsn.route(grid=r12, mn=_mn, via_tag=[True, True])

# MIDDLE
_mn = [r23(in4.p['D'])[1], r23(ip4.p['D'])[1]] # in4  ip4
vout0, rmid0, vout1 = dsn.route(grid=r23, mn=_mn, via_tag=[True, True])
_mn = [r23(in5.p['D'])[1], r23(ip5.p['D'])[1]] # in5  ip5
vout0, rmid1, vout1 = dsn.route(grid=r23, mn=_mn, via_tag=[True, True])
_mn = [r23(in1.p['D'])[1], r23(ip1.p['D'])[1]] # in1  ip1
vout0, rmid2, vout1 = dsn.route(grid=r23, mn=_mn, via_tag=[True, True])
_mn = [r23(in2.p['D'])[1], r23(ip2.p['D'])[1]] # in2  ip2
vout0, rmid3, vout1 = dsn.route(grid=r23, mn=_mn, via_tag=[True, True])

_mn = [r23(in3.p['G'])[0], r23(ip3.p['G'])[0]] # in3  ip3
_track = [r23(in3.p['G'])[0, 0]+1,None]
inA1 = dsn.route_via_track(grid=r23, mn=_mn, track=_track)
inA1 = inA1[-1] 

ds0 = r23(ip0.p['G'])[0]
ds1 = r23(in2.p['G'])[0]
_mn = [ds0, [ds0[0]-1, ds0[1]]]  # in0  ip1
rmid4 = dsn.route(grid=r12, mn=_mn, via_tag=[True, True])
# rmid4 = rmid4[1]
_mn = [[ds0[0]-1, ds0[1]], [ds0[0]-1, ds1[1]-2]]  # in0  ip1
rmid5 = dsn.route(grid=r23, mn=_mn, via_tag=[True, True])
_mn = [[ds0[0]-1, ds1[1]-2], [ds1[0]-1, ds1[1]-2]]  # in0  ip1
rmid6 = dsn.route(grid=r12, mn=_mn, via_tag=[True, True])
_mn = [[ds1[0]-1, ds1[1]-2], [ds1[0]-1, ds1[1]]]  # in0  ip1
rmid7 = dsn.route(grid=r23, mn=_mn, via_tag=[True, True])
_mn = [[ds1[0]-1, ds1[1]], ds1]  # in0  ip1
rmid8 = dsn.route(grid=r12, mn=_mn, via_tag=[True, True])

_mn = [[r23(in4.p['D'])[1,0], r23(in4.p['D'])[1,1]+2], [ds0[0]-1, r23(in4.p['D'])[1,1]+2]]
rmid9 = dsn.route(grid=r23, mn=_mn, via_tag=[None, None])

_mn = [[r23(in5.p['D'])[1,0], r23(in5.p['D'])[1,1]+2], [r23(in3.p['G'])[0,0]+1, r23(in5.p['D'])[1,1]+2]]
rmid10 = dsn.route(grid=r23, mn=_mn, via_tag=[None, None])


_mn = [r23(in0.p['D'])[1], [r23(in0.p['D'])[1,0], r23(in1.p['RAIL'])[1,1]], r23(in1.p['RAIL'])[1]]
vout0, conn0, vout1, conn01, vout2 = dsn.route(grid=r23, mn=_mn, via_tag=[True, None, True])
_mn = [r23(in3.p['D'])[1], [r23(in3.p['D'])[1,0], r23(in2.p['RAIL'])[0,1]], r23(in2.p['RAIL'])[0]]
vout0, conn1, vout1, conn11, vout2 = dsn.route(grid=r23, mn=_mn, via_tag=[True, None, True])
_mn = [r23(ip0.p['D'])[1], [r23(ip0.p['D'])[1,0], r23(ip1.p['RAIL'])[1,1]], r23(ip1.p['RAIL'])[1]]
vout0, conn2, vout1, conn21, vout2 = dsn.route(grid=r23, mn=_mn, via_tag=[True, None, True])
_mn = [r23(ip3.p['D'])[1], [r23(ip3.p['D'])[1,0], r23(ip2.p['RAIL'])[0,1]], r23(ip2.p['RAIL'])[0]]
vout0, conn3, vout1, conn31, vout2 = dsn.route(grid=r23, mn=_mn, via_tag=[True, None, True])

#==================================================

# OUT
_mn = [r23(ip1.p['D'])[1], r23(ip2.p['D'])[1]]
vout0, rout0, vout1 = dsn.route(grid=r23, mn=_mn, via_tag=[True, True])

# VSS
rvss0 = dsn.route(grid=r12, mn=[r12.mn.bottom(in4.p['RAIL']), r12.mn.bottom(in0.p['RAIL']), r12.mn.bottom(in3.p['RAIL']), r12.mn.bottom(in5.p['RAIL'])])

# VDD
rvdd0 = dsn.route(grid=r12, mn=[r12.mn.bottom(ip4.p['RAIL']), r12.mn.bottom(ip0.p['RAIL']), r12.mn.bottom(ip3.p['RAIL']), r12.mn.bottom(ip5.p['RAIL'])])

# PIN
pinA  = dsn.pin(name='A',   grid=r23, mn=inA1)
pinB  = dsn.pin(name='B',   grid=r23, mn=inB1)
pout0 = dsn.pin(name='O',   grid=r12, mn=rout0)
pvss0 = dsn.pin(name='VSS', grid=r12, mn=rvss0[1])
pvdd0 = dsn.pin(name='VDD', grid=r12, mn=rvdd0[1])

export_path = '/WORK_jupiter/shchon/training/bag_workspace_gpdk045/'
# BAG Export
#laygo2.interface.bag.export(lib, #filename=export_path+'logic_generated/'+libname+'_'+cellname+'.il', cellname=None, scale=1e-3, reset_library=False, tech_library=tech.name) 
#Expoet to Template Database
nat_temp = dsn.export_to_template()
laygo2.interface.yaml.export_template(nat_temp, filename = export_path+libname+'_templates.yaml', mode='append')


