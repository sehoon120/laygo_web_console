# C:\For_english_only_directories\LaygoWebConsole\bag_workspace_gpdk045\laygo3\laygo2\object\database.py Design 객체에 member function으로 추가
# 바로 아래 Instance의 Pin 위치가 확인가능하도록 해야 함 => 수정되었지만 검증필요
def export_to_webconsole(self, grids:list=[]):
        """
        Return data for drawing layout(libname, cellname, subblocks, vias, pins, metals)

        Parameters
        ----------
        grids
            List of RoutingGrids. Need to handle via

        Return
        ------
        dict()
            Data for drawing layout
        """
        dsn_dict = dict()
        dsn_dict["bbox"]        = self.bbox.tolist()
        dsn_dict["libname"]     = self.libname
        dsn_dict["cellname"]    = self.cellname
        dsn_dict["subblocks"]  = list()
        dsn_dict["metals"]      = list() 
        dsn_dict["vias"]        = list()
        dsn_dict["pins"]        = list()#dict() # by termname
        dsn_dict["flatten"]     = dict()
        dsn_dict["flatten"]["subblocks"] = list()
        dsn_dict["flatten"]["metals"] = list()
        dsn_dict["flatten"]["vias"] = list()

        # generate via_table from grids
        via_table = dict()
        for _grid in grids:
            for tvia in _grid.viamap.elements[0]:
                via_table[tvia.cellname] = [_grid.hlayer[0][0], _grid.vlayer[0][0]]

        pins = self.pins

        # export top via & subblocks(Physical instance)
        for _instName, _inst in self.instances.items():
            if _inst.cellname in via_table: # key is default find target
                # export via
                _via = dict()
                _via["xy"] = _inst.xy.tolist()
                _via["bbox"] = _inst.bbox.tolist()
                _via["layer"] = via_table[_inst.cellname]
                dsn_dict["vias"].append(_via)
            else: 
                if "NoName" in _instName: # via or other instances which is not sub-block -> maybe omitted in future
                    continue
                _sub_block = dict()
                _sub_block['name'] = _instName
                _sub_block['cellname'] = _inst.cellname
                _sub_block['libname'] = _inst.libname
                _sub_block['xy'] = _inst.xy.tolist()
                _sub_block['size'] = _inst.bbox.tolist()
                _sub_block['transform'] = _inst.transform
                _sub_block['pins'] = dict()
                for _pinName, pin in _inst.pins.items():
                    _sub_block['pins'][_pinName] = dict()
                    _sub_block['pins'][_pinName]['termName'] = _pinName 
                    _sub_block['pins'][_pinName]['bbox'] = pin.bbox.tolist()
                dsn_dict['subblocks'].append(_sub_block)
        
        #Extract virtual instances
        for _instName, _inst in self.virtual_instances.items():
            if "NoName" in _instName: # via or other instances which is not sub-block -> maybe omitted in future
                continue
            _sub_block = dict()
            _sub_block['name'] = _instName
            _sub_block['cellname'] = _inst.cellname
            _sub_block['libname'] = _inst.libname
            _sub_block['xy'] = _inst.xy.tolist()
            _sub_block['bbox'] = _inst.bbox.tolist()
            _sub_block['transform'] = _inst.transform
            _sub_block['pins'] = dict()
            for _pinName, pin in _inst.pins.items():
                _sub_block['pins'][_pinName] = dict()
                _sub_block['pins'][_pinName]['termName'] = _pinName 
                _sub_block['pins'][_pinName]['bbox'] = pin.bbox.tolist()
            dsn_dict['subblocks'].append(_sub_block)

        # export top metals
        metals = self.rects
        for _mname, _m in metals.items():
            _xy = _m.xy.tolist()
            if _xy[0][0] > _xy[1][0]:
                _xy[0][0], _xy[1][0] = _xy[1][0], _xy[0][0]
            if _xy[0][1] > _xy[1][1]:
                _xy[0][1], _xy[1][1] = _xy[1][1], _xy[0][1]
            _xy = [[_xy[0][0]-int(_m.hextension), _xy[0][1] - int(_m.vextension)],[_xy[1][0]+int(_m.hextension), _xy[1][1]+int(_m.vextension)]]
            _metal = dict(xy=_xy, layer=_m.layer[0])
            dsn_dict["metals"].append(_metal)
        # export top pins
        for pin in self.pins.values():
            _pin = dict(name = pin.name, xy = pin.xy.tolist(), layer=pin.layer[0], bbox=pin.bbox.tolist())
            dsn_dict['pins'].append(_pin)

        # flatten virtual instances and add it to dict -> To show expanded circuit at console
        pin_list, via_list, metal_list, cell_list = self.flatten_virtual_instance(via_table)
        dsn_dict["flatten"]["subblocks"].extend(cell_list)
        for _m in metal_list:
            _xy = _m.xy.tolist()
            if _xy[0][0] > _xy[1][0]:
                _xy[0][0], _xy[1][0] = _xy[1][0], _xy[0][0]
            if _xy[0][1] > _xy[1][1]:
                _xy[0][1], _xy[1][1] = _xy[1][1], _xy[0][1]
            _xy = [[_xy[0][0]-int(_m.hextension), _xy[0][1] - int(_m.vextension)],[_xy[1][0]+int(_m.hextension), _xy[1][1]+int(_m.vextension)]]
            _metal = dict(xy=_xy, layer=_m.layer[0])
            dsn_dict["flatten"]["metals"].append(_metal)
        for _v in via_list: # vias are already processed
            dsn_dict["flatten"]["vias"].append(_v)

        return dsn_dict
