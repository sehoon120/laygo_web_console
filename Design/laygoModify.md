# LAYGO 수정사항 / 수정중(2025-08-04)

## 개요
- Web console 수정을 위한 laygo 코드 수정 내용 정리
- Laygo 함수 추가와 환경변수 수정이 필요
- PDK로 GPDK45를 사용하는 경우 기준으로 설정

## 환경변수 수정
- 서버 내에 저장된 bag_workspace_gpdk45의 자원들을 이용해 레이아웃을 생성한다.
- \bag_workspace_gpdk045\gpdk045\workspace_setup\.cshrc_bag 변경
    + setenv BAG_PYTHON "/TOOL/Anaconda/current/bin/python3.7" -> setenv BAG_PYTHON "/usr/bin/python3"
- \bag_workspace_gpdk045\gpdk045\laygo2_tech\core.py 변경
    + 서버 구현 시 실행 dir의 차이 때문에 tech_fname 경로 변경
    ```
    base_dir = os.path.dirname(os.path.abspath(__file__))
    tech_fname = os.path.join(base_dir, 'laygo2_tech.yaml')
    ```
- \bag_workspace_gpdk045\gpdk045\laygo2_tech\flex.py 변경
    + 서버 구현 시 실행 dir의 차이 때문에 tech_fname 경로 변경
    ```
    base_dir = os.path.dirname(os.path.abspath(__file__))
    tech_fname = os.path.join(base_dir, 'laygo2_tech.yaml')
    ```
- \bag_workspace_gpdk045\start_bag_test.sh 추가 (이후 이름 변경 예정)
    + Web console에서 layout의 생성을 위해 실행하는 script
    + Pseudocode
    ```
    # $PYTHONPATH 설정 -> Laygo pakage들 import 위함
    export PYHONPATH = "서버내 bag_workspace_gpdk45 경로 : $PYTHONPATH"
    export PYHONPATH = "서버내 bag_workspace_gpdk45/laygo2 경로 : $PYTHONPATH"

    # 서버의 fileController에서는 스크립트 실행 인자로 순서대로 generate를 시도한 유저명(USERNAME), 실행한 파일명(FILENAME), Laygo script가 임시로 저장되어 있는 경로(CODE_PATH), Web console의 최상위 디렉터리(RUNDIR)를 준다.

    # 로그 파일 생성
    make directory when there is no RUNDIR/temp
    LOG_FILE = RUNDIR/temp/USERNAME_FILENAME_output.log

    # 기타 실행 중 메시지 출력
    (생략)
    
    # 스크립트 실행 및 로그 저장
    {BAG_PYTHON or python3} CODE_PATH >> LOG_FILE
    ```

## Laygo에 web console용 출력 함수 추가
- 기존 LAYGO의 export 메커니즘
    + laygo2.interface.yaml.export_template : Template object와 출력할 filename 받아 yaml로 출력 수행. Template을 dict로 변환 후 그것을 yaml로 출력. 
    + class laygo2.object.database.Design의 member function export_to_template : Design object를 NativeInstanceTemplate로 출력
        + 문제 1) Subblock의 출력 안 됨
        + 문제 2)
        + Prototype에서의 수정 내역:  object/database.py line 1759 -> subblock에 virtual instance들도 추가
    + class laygo2.object.template.NativeInstanceTemplate의 member function export_to_dict : NativeInstanceTemplate을 python dict로 출력
        + libname, cellname, bbox, pins, masks, subblocks, metals 출력
        + Prototype에서의 수정 내역: subblock이 virtual instance일 경우 해당 virtual instance의 size와 pin을 추가해 export
        + 문제) metal 출력의 metal['xy']에 두께 데이터가 존재하지 않음
    + 두께 데이터(hextension, vextension)은 어디에 있는가?
        + 1) Routing 과정에서(RoutingGrid 클래스의 라우팅 관련 함수들-route() 등-에서) 생성 후 metal에 해당하는 Rect 객체에 담아 반환
        + 2) Routing 과정: Design 객체의 route 함수에서 RoutingGrid의 route 함수 호출해 metal 생성 후, 내부 리스트에 append해 저장
        + 3) 따라서, design.export_to_template에서 export 시 hextension / vextension을 포함하지 않는 것이 문제가 된다.
        + 4) Design.rect의 metal들에는 extension들이 포함되어 있다.
    + Skill, yaml export 코드 예시
```
        # 7. Export to physical database.
        print("Export design\n")
        laygo2.export(lib, tech=tech, filename=export_path_skill+libname+'_'+cellname+'.il')
        # Filename example: ./laygo2_generators_private/logic/skill/logic_generated_nand_2x.il
 
        # 8. Export to a template database file.
        nat_temp = dsn.export_to_template()
        laygo2.export_template(nat_temp, filename=export_path+libname+'_templates.yaml', mode='append')
        # Filename example: ./laygo2_generators_private/logic/logic_generated_templates.yaml
```

- 기존 YAML로의 export로 출력된 export data는 두께 데이터를 포함하고 있지 않으며, 따라서 draw를 위해 추가가 필요하다.
- 추가 함수 1: laygo2.interface.yaml.export_for_webconsole(filename)
    + templete database(YAML 라이브러리)로의 export와 출력을 위한 파일 생성(각 Laygo 스크립트별로 할당된 YAML 파일) 수행
    + parameter: template:"laygo2.object.template.Template", filename:str, mode:str='append'
    + 출력(외부 파일 출력): Template database update(export_yaml과 같은 방법) / YAML output file for layout drawing
- 추가 함수 2: laygo2.object.design.Design에 export_to_template (?) 그냥합칠까 흠