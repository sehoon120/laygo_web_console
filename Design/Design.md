# 파일 용도
결과로서 만들어질 각 파일과 디렉터리들의 역할, 관계 정리. 해당하는 파일, 디렉터리의 구체적 구조는 각 파일에 해당하는 markdown file에 적을 것.


# 전체 구조
- root directory
    + config(DIR)
        + dbConnect.js
        + mailer.js
    + controllers(DIR)
        + fileController.js
        + loginController.js
    + middlewares(DIR)
        + JWT.js
    + models(DIR)
        + contactModel.js
        + fileModel.js
        + userModel.js
    + node_modules(DIR)
        + 설치한 node.js module 관련 파일들 위치
    + public(DIR)
        + style.css
    + routes(DIR)
        + fileRoutes.js
        + loginRoutes.js
        + logoutRoutes.js
    + temp(DIR)
        + output 등 보기 위한 임시폴더
    + views(DIR)
        + include(DIR)
            + _footer.ejs
            + _header.ejs
            + _header_home.ejs
        + 404.ejs
        + add.ejs
        + edit.ejs
        + getallfiles.ejs
        + home.ejs
        + register.ejs
        + update.ejs
    + .env
    + app.js


# DIR: config
- DB/mail 초기 연결 관련 파일
- dbConnect.js: DB연결
    + 함수: dbConnect
- mailer.js: mail 연결
    + 메일 연결 객체: transporter

# DIR: controllers
- DB와의 연결, 수정 등 고려한 backend 구성 파일들
- fileController.js: /main url에서 사용될 파일 수정 및 실행과 관련된 함수 객체들 작성
    + 
- loginController.js

# DIR: middlewares
- JWT.js
    + jsonwebtoken 관련 코드
    + 세션이 유효한지 확인하는 authenticateJWT 함수

# DIR: models
- MongoDB schema 정의
- contactModel.js
    + contact 관련 정보에 대한 schema
- fileModel.js
    + 각 file의 정보에 대한 schema
- userModel.js
    + 각 user의 정보에 대한 schema

# DIR: public
- style.css: 페이지 형태 정의(root)

# DIR: routes
- router 모음
- fileRoutes.js: file 관련 route
    + add.js서 /main 아래로 들어가게 된다.
    + 관련 페이지들에 접근 시(get, put, post method 등) fileController의 함수 객체들에 연결해 대응
    + 관련 기능: (추가필요)
    + 사용 파일: fileController
- loginRoutes.js: login 관련 route
    + 관련 페이지들에 접근 시 loginController의 함수 객체들에 연결해 대응
    + 관련 기능: 로그인 페이지, 회원등록 페이지, 회원등록 시 이메일 인증
    + 사용 파일: loginController
- logoutRoutes.js: login 관련 페이지들 route
    + add.js서 /logout 아래로 들어가게 된다.
    + 관련 기능: logout 시 root directory로 돌아가도록 구현

# DIR: temp
    - 운영 중 log file 등 저장 위한 임시 DIR
# DIR: views
- EJS engine이 렌더링할 페이지들이 들어있는 디렉터리
- 404.ejs
    + 404 페이지 렌더
    + 이용하는 파일, I/O: ./include/_header_home, ./include/_footer, app.js
- add.ejs
    + File upload 페이지 렌더. 업로드된 파일에 대해 filename과 filetype을 매개로 POST 수행
    + 이용하는 파일, I/O: ./include/_header_home, ./include/_footer, app.js
- edit.ejs
    + File 내용 editor + Layout viewer
    + Prototype과 달리 file save, generate, layout draw 3개 기능 각각 분리(버튼 3개)
    + 이용하는 파일, I/O: ./include/_header_home, ./include/_footer, app.js, (수정필요)
- getallfiles.ejs
- home.ejs
    + 로그인 및 회원가입(register page로 연결)
    + 이용하는 파일, I/O: ./include/_header_home, ./include/_footer, app.js
- register.ejs
    + 회원가입 페이지. ID/PW는 POST 통해 전송. 이메일 인증 기능은 loginRoutes 통해 연결됨(기능 body는 loginController에 존재)
    + 이용하는 파일, I/O: ./include/_header_home, ./include/_footer, app.js -> loginController -> loginController
- update.ejs
    + 파일 정보 수정.
    + 이용하는 파일, I/O: ./include/_header_home, ./include/_footer, app.js

# FILE: .env
- 환경변수 저장
    + mongoDB 로그인 관련 변수들(서버당 개별로 주어짐), 메일 자동전송 관련 변수들

# FILE: app.js
- javascript 메인 모듈
    + 라우팅: 로그인 페이지를 root에, 로그아웃 페이지를 /logout에, 로그인 이후 파일 관리 페이지를 /main에 연결 => routes DIR의 
    + 권한 검사를 위해, jsonwebtoken(JWT) 이용해야 하므로, 연결
    + 잘못된 접근 시 404 연결
    + 이용하는 파일, I/O: use dbConnect from /config/dbConnect.js, use router files from /route => 최종적으로 view와 연결, use /middlewares/JWT
