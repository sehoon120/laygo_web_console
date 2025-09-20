# 서버에서 할 일

## 초기 환경 설정

```
# 기본 패키지 설치
sudo apt update && sudo apt -y upgrade
sudo apt -y install git build-essential curl ufw

# nvm 설치
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc

# LTS 설치
nvm install --lts
node -v
npm -v

cd ~
git clone https://github.com/sehoon120/laygo_web_console.git app
cd app
# sehoonver3의 app.js 사용

# 의존성
npm ci || npm i

```

## 서버 실행 과정

```
1. 서버 방화벽에서 3000 열기 (Ubuntu/UFW 예시)
# 연구실 서브넷만 허용
sudo ufw delete allow 3000/tcp
sudo ufw allow from 166.104.35.114 to any port 3000 proto tcp

sudo ufw status verbose

2. 서버의 내부 IP 확인
hostname -I
# 예: 166.104.35.114~?


3. 실행
node app.js        # 또는 npx nodemon app.js -> 개발용
# 계속 돌리려면 pm2 권장:
# npm i -g pm2
# pm2 start app.js --name myapp && pm2 save

3.1. 상시 운영
npm i -g pm2
pm2 start app.js --name myapp
pm2 save
pm2 startup systemd   # 출력되는 안내 한 줄을 sudo로 실행
pm2 logs myapp


4. 다른 PC에서 접속
브라우저에서 http://166.104.35.114:3000 (서버 IP:포트)
문제 생기면:
ss -ltnp | grep 3000   # → 0.0.0.0:3000 또는 *:3000 이면 OK, 127.0.0.1:3000이면 코드 바인딩 수정 필요
# 방화벽 규칙 확인
sudo ufw status verbose
# 로그
pm2 logs myapp          # PM2 사용 시
# 또는
journalctl -xe          # 시스템 로그
```

## 컨테이너로 Node 버전 고정해서 돌리기

OS가 구형이어도 Docker/Podman만 설치되면, OS와 독립적으로 원하는 Node LTS로 앱을 띄울 수 있다.

Dockerfile (프로젝트 루트)
```
# 필요에 따라 18(=LTS), 20, 22 중 앱이 도는 버전 선택
FROM node:18-bullseye

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "app.js"]  # 진입파일명에 맞게
```

빌드 & 실행
```
# 서버에서
docker build -t myapp .
# .env 파일이 있다면 --env-file 옵션 권장
docker run -d --name myapp -p 3000:3000 --env-file .env --restart unless-stopped myapp
```

방화벽(UFW) 열기(내부망만):
```
sudo ufw allow from <연구실대역>/24 to any port 3000 proto tcp
```