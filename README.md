# Laygo Webconsole

Laygo Webconsole은 **Laygo 기반 회로 설계/배치 자동화**를 웹 환경에서 실행할 수 있도록 만든 관리 도구이다.
Node.js와 PM2를 기반으로 동작하며, MongoDB를 연동해 사용자/프로젝트 데이터를 관리한다.

---


## 📂 프로젝트 구조


```bash
laygo_web_console/
├── Design/ # 서버 구성요소 분석 (JS, EJS, CSS 등)
│ # 내부 함수 동작, 추가 요구사항 문서화
│
├── Implementation/ # 리눅스 서버 이전 전 사용된 통합 Webconsole 서버
│
├── Implementation_linux/ # 현재 리눅스 서버에서 사용하는 Webconsole 서버
│
├── jeyun/ # 개발자 개인 workspace (jeyun)
│
├── sehoon/ # 개발자 개인 workspace (sehoon)
│
├── Test/ # 테스트 코드 및 실험용 디렉토리
│
└── README.md # 설치/사용 가이드 문서
```

📌 **폴더 설명**
- **Design/**: 서버 각 구성요소(JS, EJS, CSS 등)의 동작 방식 분석 및 요구사항 정리
- **Implementation/**: 리눅스 서버 이전 버전 (통합 Webconsole 서버)
- **Implementation_linux/**: 리눅스 서버에서 사용되는 현재 Webconsole 서버
- **jeyun/**, **sehoon/**: 각 개발진의 개인 workspace
- **Test/**: 테스트 및 실험용 디렉토리
- **README.md**: 설치/사용 가이드

---


## 🚀 초기 세팅

### 1) Node.js & PM2 설치
```bash
# Node.js 설치 (nvm 사용)
nvm install 20
nvm use 20
nvm alias default 20

# PM2 설치
npm i -g pm2
```

**버전 확인**

```bash
node -v   # v20.x
npm -v
pm2 -v
```

---

### 2) Webconsole 코드 가져오기

`bag_workspace_gpdk045` 디렉토리와 같은 경로에서 실행:

```bash
git clone https://github.com/sehoon120/laygo_web_console.git laygo_web_console
```

---

### 3) Laygo 코드 변경 반영

`laygo_web_console/Implementation_linux/Laygo/` 디렉토리에
**수정된 파일 모음**이 있음. 해당 변경사항을 기존 Laygo 코드에 반영해야 한다.

---

### 4) 패키지 설치

```bash
cd laygo_web_console/Implementation_linux/server
npm install
```

---

### 5) 환경 변수 설정

`server/.env` 파일 생성:

```env
# Database
DB_CONNECT = mongodb+srv://<copy_connection_code>
JWT_SECRET = <랜덤 문자열>

# Mailer (네이버 계정)
NAVER_USER = <ID>@naver.com
NAVER_PASS = <앱 비밀번호 또는 보안코드>

# TLS
NODE_TLS_REJECT_UNAUTHORIZED = '0'

# Laygo 경로 (배포 환경에 맞게 수정)
LAYGO_DIR = /WORK/bag_workspace_gpdk045

# 서버 설정
PORT = 3000
HOST = 0.0.0.0
NODE_ENV = production
```

---

### 5.5) 포트 확인 (선택 사항)

3000 포트가 열려 있는지 확인하는 방법:

```bash
# 리눅스에서 포트 확인
sudo lsof -i :3000

# 또는 netstat 사용
sudo netstat -tulnp | grep 3000

# 방화벽 설정 (예: ufw 사용 시)
sudo ufw allow 3000/tcp
```

---

### 6) Webconsole 최초 실행

```bash
PORT=3000 HOST=0.0.0.0 pm2 start app.js --name webconsole --update-env
```

---

### 7) 서버 접속

브라우저에서 접속:

```
http://<서버IP>:3000
```

---

## ⚙️ Webconsole 관리 (on/off)

### 상태 확인

```bash
pm2 ls
pm2 logs webconsole
```

### 실행

```bash
pm2 start webconsole
```

### 중지

```bash
pm2 stop webconsole
```

### 삭제

```bash
pm2 delete webconsole
```

### 재부팅 시 자동 시작

```bash
pm2 save
pm2 startup systemd
# 안내 문구를 복사하여 sudo로 실행
```

---

## 📌 참고

* `bag_workspace_gpdk045` 와 같은 경로에서 clone해야 Laygo 연동이 원활하다.
* `.env` 파일은 절대 Git에 push를 금지한다. (`.gitignore` 등록 권장)



# laygo_web_console

## 천세훈
cd sehoon/ver1
nodemon app.js
http://localhost:3000/

환경변수 설정
UBUNTU Terminal     .cshrc_bag
  cd /mnt/c/GraduationProject/bag_workspace_gpdk045
  export BAG_WORK_DIR=$(pwd)
  export BAG_FRAMEWORK="$BAG_WORK_DIR/BAG_framework"
  export BAG_PYTHON="/home/happy/anaconda3/envs/Laygo/bin/python3.7"

- mongoDB사용 -> 파일, 유저정보 저장
- 회원가입, 로그인, 메일 인증 
- 파일 목록 확인, 경로별 나열
- 파일 편집, 삭제 가능
- 파일 업로드 가능
- 파일 실행가능 -> py to yaml
- 생성 파일 경로별 저장, 유저별 yaml 인식
- 실행 후 temp, log 파일 정리
- OUTPUT TERMINAL추가
- 우측 화면에 layout display 추가 완료 -> ver2

- 파일 export 추가 예정
- 로그, temp파일 안남도록 변경 예정


Nifty github 임의 변경점:
    \bag_workspace_gpdk045\gpdk045\workspace_setup\.cshrc_bag       변경
        setenv BAG_PYTHON "/home/happy/anaconda3/envs/Laygo/bin/python3.7"   # "/TOOL/Anaconda/current/bin/python3.7"

    \bag_workspace_gpdk045\start_bag_test.sh                        파일 추가

    \bag_workspace_gpdk045\gpdk045\laygo2_tech\core.py              경로 설정 추가

    \bag_workspace_gpdk045\gpdk045\laygo2_tech\flex.py              경로 설정 추가


## 박제윤
- ver1 -> 로그인 등 기타 기능은 레이고 시각화 위해 필요한 정도로만 대충 구현하고 시각화에 주력해서 만드는 중  
- MySQL 사용 -> 일단 신경쓰지 않아도 됨(로컬에 MySQL 미설치 시 코드 동작 불가함. 실행시켜보고 싶을 경우 연락바람)  
- Yaml에 있는 값 읽어서 HTML canvas 혹은 WebGL로 그래픽화 가능할지 보는 중  
- Yaml file 변환 -> npm에서 js-yaml 패키지 인스톨 필요

- 현재 구현 수준: PMOS draw 성공, dff draw 성공. 이때 metal vector는 그리는 데 문제가 있음(hextension, vextension 없어 폭 0)
- Zoom in/out 구현 완료 -> https://stackoverflow.com/questions/5189968/zoom-canvas-to-mouse-cursor/5526721#5526721 보고 작성함
- Layer별 끄기/켜기 구현 완료. 버튼 클릭을 통해 켜기/끄기 가능
- Grid 설정: canvas에서 grid를 직접 지원하지는 않아 확대/축소 시 문제가 있음. 일단 제외.

- 2025/4/9~ Design.export_to_template 쪽 손보는 중;(templete.py) mos bbox 출력 목표; Design.virtual_instance 밑에 mos들 존재 / template.export_to_dict도 수정(template core.py)


## 통합(DESIGN)
- Design directory서 진행중
- 개선 필요 requirements들 정리: 해당 requirements들을 보고 DESIGN 수정 수행
```
개선 필요 requirements
중요도는 上/中/下로 분류
上: 반드시 수정되어야 하는 사항
中: 반드시 수정될 필요는 없으나 가급적이면 수정되어야 하는 사항
下: 시간이 남으면 추가하면 좋을 기능 -> 정리된 개선 req들에서 下는 일단 제거함
 
-Edit 페이지에서 Save&Generate 이외에 Layout draw 여부를 선택 가능하게 수정(上)
->save/generate/draw 버튼 분리
 
-Export path는 상대경로로 지정하도록 수정(보류)

-라이브러리인 Yaml 파일이 커지게 되면 generate 및 layout draw에 많은 시간이 걸림. 이보다 빠른 속도로 draw 하는 방법이 필요할 수 있음(中)
->save/generate/draw 버튼 분리
 
-Origin 기준 x, y 축 표시

-instance에는 instance name, instance libname, cellname 표시 필요

-grid drawing에 있어서, x, y축만을 그리는 것으로 requirement를 완화 / 혹은 dsb.bbox 내에만 그리드 줌

-Layer 별로 표시를 켜고 끄는 기능. Instance / Instance pin 끄고 켜는 기능


 
-Routing metal drawing: Yaml 파일로 출력 시 metal의 두께 정보가 담겨 나오지 않음. 따라서 일단 미구현됨. Pin과 동일한 방식으로 표시되고, 켜기/끄기가 된다고 생각하면 됨.
->논의사항: 조사 결과 hextenstion, vextension에 두께가 담겨져 있어서 skill export 시에 두께를 정의하게 된다고 하는데, yaml 출력 시에도 이러한 방식으로 해도 될 지 확인이 필요함.
->아니 근데 이걸 레이고 안 고치고 할 수 있나
 

```

- (중요)Requirements 변경에 따른 prototype과의 design 변경점
    + 1) Edit 페이지에서 Save&Generate 이외에 Layout draw 여부를 선택 가능하게 수정(上) => Edit 페이지에서 save(&delete previous generation result)와 generate버튼, layout draw 버튼 분리.(edit.ejs, fileRoutes.js, fileController.js)
        -> 개선 완료 - sehoon/ver3에서 cellname 자동 추출 방식은 고안이 필요함 
        -> 파이썬 코드 보고 간단한 libname, cellname 자동추출 기능 제작 + 여전히 수동 지정 가능
    + 2) Origin 기준 x, y 축 표시 => Drawing 하는 페이지 코드 수정(edit.ejs)
        -> 개선 완료 - sehoon/ver3에서
    + 3) instance에는 instance name, instance libname, cellname 표시 필요 => Drawing 하는 페이지 코드 수정(edit.ejs)
        -> 공유받은 inv_2x.yaml을 기준으로 빌드맵 재 작성중 - sehoon/ver3/~/edit.ejs.buildMap_ver2
    + 4) Layer 별로 표시를 켜고 끄는 기능. Instance / Instance pin 끄고 켜는 기능 => Drawing 하는 페이지 코드 수정(edit.ejs)
    + 4) Routing metal drawing 시 두께 값 추출: Laygo 함수 추가...?(fileController.js 수정 + laygo 신규 함수 추가)
        + laygo 신규 함수: yaml로 두께 값을 포함한 정보를 출력하는 함수(기존 yaml 출력 함수를 상속받아 작성?)
        + WebConsole에서 laygo script 실행 시 자동으로 뒤에 위의 함수를 붙여 실행시키고, 임시 디렉터리에 결과 출력 후 그것을 읽어 그릴 수 있게 한다.
        + layout draw 함수 수정: 공유받은 inv_2x.yaml을 기준으로 drawLayout_ver2 작성중 - sehoon/ver3/~/fileController.js.drawLayout_ver2

- ToDo list(2025-08-04): Design 파트에서 수정 및 좀 더 자세히 해야 할 부분 존재
    + 1) Laygo 함수 추가에 대한 부분 -> 일단 정확히 이번 프로젝트에 속한 것은 아니라서 제외했었음. 그러나 이 부분도 작성은 해놓는게 좋을 듯 함. => 진행중(박제윤)
    + 2) fileController.md에서 함수의 내용 수정된 부분 반영
    + 3) Controller 수정 반영에 따라 router 수정 필요 시 수정


## 구현(Implementation)
- Prototype과 동일하게 이용하는 code
    + /config, /controllors/loginController.js, /middlewares, /models, /public, /routes/loginRoutes.js, /routes/logoutRoutes.js, /views/include, /views/404.ejs, /views/add.ejs, /views/getallfiles.ejs, /views/home.ejs, /views/update.ejs, /views/register.ejs

- 진행상황(박제윤)
    + laygo import 함수 수정 구현 완료, 이후 실제 운영 시에는 DB URL 관련 수정해 운용. 또한 이를 위한 start_bag_test.sh 수정
    + laygo template export도 수정 완료,  따라서 templete import, export 시 local이 아니라 DB에서 사용하도록 수정 완료
    + (진행중)script에 username 포함하도록 수정
    + (진행중)출력용 yaml 뽑기
        + interface.core.export 수정 -> 수정완료
        + interface.webconsole.export() 만들기 -> 만드는중
    + 해당 수정 내용은 webconsole 디렉터리가 아니라 laygo에 대한 수정사항이므로, 구현이 모두 완료된 후 교수님의 최종 컨펌을 받아 반영할 것임
