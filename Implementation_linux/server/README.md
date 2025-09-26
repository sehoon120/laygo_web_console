````markdown
# Laygo Web Console 서버 운영 가이드

## 1. 환경 세팅

### Node.js & PM2 설치
1. **nvm 설치 후 Node 20 LTS 사용**
   ```bash
   nvm install 20
   nvm use 20
   nvm alias default 20
````

2. **PM2 설치**

   ```bash
   npm i -g pm2
   ```

3. **버전 확인**

   ```bash
   node -v   # v20.x
   npm -v
   pm2 -v
   ```

---

## 2. 프로젝트 배포

1. **코드 가져오기**

   ```bash
   git clone https://github.com/sehoon120/laygo_web_console.git laygo_web_console
   cd laygo_web_console/sehoon/ver3
   ```

2. **패키지 설치**

   ```bash
   npm install
   ```

3. **환경 변수 설정**
   `.env` 파일 생성:

   ```env
   PORT=3000
   HOST=0.0.0.0
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```

---

## 3. 서버 실행 & 관리

### 3.1 PM2로 실행 (권장)

```bash
cd /WORK/laygo_web_console/sehoon/ver3

# 처음 실행
PORT=3000 HOST=0.0.0.0 pm2 start app.js --name webconsole --update-env

# 상태 확인
pm2 ls
pm2 logs webconsole
```

### 3.2 서버 끄기 / 켜기

```bash
# 끄기
pm2 stop webconsole

# 켜기
pm2 start webconsole

# 완전히 삭제
pm2 delete webconsole
```

### 3.3 재부팅 시 자동 시작

```bash
pm2 save
pm2 startup systemd
# 안내 문구 복사 후 sudo로 실행
```

---

## 4. 서버 접속

### 4.1 로컬에서 헬스체크

```bash
curl http://127.0.0.1:3000/healthz
# -> ok
```

### 4.2 외부에서 접속

브라우저에서:

```
http://<서버IP>:3000
```

예: `http://163.44.254.111:3000`

---

## 5. 유용한 명령어 모음

```bash
# 앱 로그 확인
pm2 logs webconsole

# 특정 포트 점유 확인
ss -ltnp | grep 3000

# pm2 데몬 초기화
pm2 delete all
pm2 kill
rm -rf ~/.pm2
```
