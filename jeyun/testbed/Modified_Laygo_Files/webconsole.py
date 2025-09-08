#bag_workspace_gpdk045\laygo3\laygo2\interface\webconsole.py
"""
This module implements interfaces with webconsole server

"""

import yaml
import os
import os.path
import laygo2
from pymongo import MongoClient     #Modified for webconsole
from datetime import datetime

def export(
            db: "laygo2.object.database.Library",
            username: str,
            tech: "laygo2.object.technology.BaseTechnology" = None
    ):
    """
    Export drawing data for webconsole in yaml format

    Parameters
    ----------
    db : "laygo2.object.database.Library"
        Data to be exported
    username : str
    tech: "laygo2.object.technology.BaseTechnology"
        Need for extracting grid informations

    Return
    -------
    str 
        The generated webconsole drawing generation data
    """

    #Change on operation
    DB_CONNECT = os.environ['DB_CONNECT']
    client = MongoClient(DB_CONNECT)
    testdb = client.test
    collection = testdb['files']

    templates = tech.load_templates()
    grids_TemplateLibrary = tech.load_grids(templates=templates)        #Grids with TemplateLibraray object
    grids = list()
    for key, val in grids_TemplateLibrary.items():
        if isinstance(val, laygo2.object.grid.RoutingGrid):
            grids.append(val)
    

    for element in db.elements:                 #elements of Library = Design
        temp_dictionary = db[element].export_to_webconsole(grids=grids)

        libname = temp_dictionary['libname']
        cellname = temp_dictionary['cellname']
        yamlFilePath = username+'/'+libname
        output_temp_dir = os.getenv('WC')+'/'+yamlFilePath
        os.makedirs(output_temp_dir, exist_ok=True)
        filename = cellname+'.yaml'
        output_temp_path = output_temp_dir+'/'+filename
        #print(output_temp_path)
        with open(output_temp_path, 'w') as stream:
            yaml.dump(temp_dictionary, stream, default_flow_style=None)
        
        yaml_string = str()
        yaml_string = yaml.dump(temp_dictionary, default_flow_style=None)
        yamlFilePath_DB = '/generated_drawing_yamls/'+libname+'/'
        yamlFile = collection.find_one({'user': username, 'filetype': 'yaml', 'filename': filename, 'filePath': yamlFilePath_DB})
        #print(yamlFilePath_DB)

        if collection.find_one({'user': username, 'filetype': 'dir', 'filename': 'generated_drawing_yamls', 'filePath': '/'}) is None:
            testdb.files.insert_one({'user': username, 'filetype': 'dir', 'filename': 'generated_drawing_yamls', 'filePath': '/', 'createdAt': datetime.now(), 'updatedAt': datetime.now()})
        
        # 현재 수정 미비로 libname 디렉터리와 각 yaml 파일들의 경우, 상위의 generated_drawing_yamls 디렉터리 삭제해도 DB에는 남아있게 됨. 주의!
        if collection.find_one({'user': username, 'filetype': 'dir', 'filename': libname, 'filePath': '/generated_drawing_yamls/'}) is None:
            testdb.files.insert_one({'user': username, 'filetype': 'dir', 'filename': libname, 'filePath': '/generated_drawing_yamls/', 'createdAt': datetime.now(), 'updatedAt': datetime.now()})    
        
        if yamlFile is None:
            testdb.files.insert_one({'user': username, 'filetype': 'yaml', 'filename': filename, 'filePath': yamlFilePath_DB, 'content': yaml_string, 'createdAt': datetime.now(), 'updatedAt': datetime.now()})
        else:
            testdb.files.update_one({'user': username, 'filetype': 'yaml', 'filename': filename, 'filePath': yamlFilePath_DB}, {'$set':{'content':yaml_string, 'updatedAt': datetime.now()}})

        