# laygo_web_console

## 천세훈
cd sehoon/ver1
nodemon app.js
http://localhost:3000/

환경변수 설정
UBUNTU Terminal
  cd /mnt/c/GraduationProject/bag_workspace_gpdk045
  export BAG_WORK_DIR=$(pwd)
  export BAG_FRAMEWORK="$BAG_WORK_DIR/BAG_framework"
  export BAG_PYTHON="/home/happy/anaconda3/envs/Laygo/bin/python3.7"

- mongoDB사용 -> 파일, 유저정보 저장
- 회원가입, 로그인, 메일 인증 
- 파일 목록 확인, 경로별 나열
- 파일 편집, 삭제 가능
- 파일 업로드 가능

- 파일 export 추가 예정

- 우측 화면에 layout display 추가 예정

- 파일 실행기능 제작중 py -> yaml
  ㄴ 파일 실행은 가능, yaml 생성 테스트중, bag 모듈 사용 오류


Nifty github 임의 변경점:
    \bag_workspace_gpdk045\gpdk045\workspace_setup\.cshrc_bag       변경
        setenv BAG_PYTHON "/home/happy/anaconda3/envs/Laygo/bin/python3.7"   # "/TOOL/Anaconda/current/bin/python3.7"

    \bag_workspace_gpdk045\start_bag_test.sh                        파일 추가


## 박제윤
- ver1 -> 로그인 등 기타 기능은 레이고 시각화 위해 필요한 정도로만 대충 구현하고 시각화에 주력해서 만드는 중  
- MySQL 사용 -> 일단 신경쓰지 않아도 됨(로컬에 MySQL 미설치 시 코드 동작 불가함. 실행시켜보고 싶을 경우 연락바람)  
- Yaml에 있는 값 읽어서 HTML canvas 혹은 WebGL로 그래픽화 가능할지 보는 중  
- Yaml file 변환 -> npm에서 js-yaml 패키지 인스톨 필요

- 현재 구현 수준: PMOS draw 성공. 하위 인스턴스 호출 기능 아직 없어 inv 구현은 아직 불가.
- Zoom in/out 구현 완료 -> https://stackoverflow.com/questions/5189968/zoom-canvas-to-mouse-cursor/5526721#5526721 보고 작성함
- Layer별 끄기/켜기 구현중. 버튼 클릭을 통해 각 레이어별 켜기/끄기 목표. m1, m2 layer서 성공.
