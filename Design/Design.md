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

# DIR: controllers

# DIR: middlewares

# DIR: models

# DIR: node_modules

# DIR: public

# DIR: routes

# DIR: temp

# DIR: views
- EJS engine이 렌더링할 페이지들이 들어있는 디렉터리들의
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

# FILE: app.js

