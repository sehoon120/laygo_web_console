# ================================================== 임의 추가
#!/usr/bin/env bash

# 우분투 터미널 기준
export PYTHONPATH="/mnt/c/GraduationProject/bag_workspace_gpdk045/laygo2:/mnt/c/GraduationProject/bag_workspace_gpdk045:$PYTHONPATH"
unset SESSION_MANAGER

# 우분투 콘다 Laygo 경로
BAG_PYTHON="/home/happy/anaconda3/envs/Laygo/bin/python3.7"
#

USERNAME="$1"
FILENAME="$2"
CODE_PATH="$3"

# ====================================================================================================
# 추가: laygo2에서 사용하기 위한 환경변수로 username/filename 전달 (임시. 이렇게 전달해도 사용 가능하겠지?)
export LAYGO_USERNAME="$USERNAME"
export LAYGO_BASENAME="$FILENAME"

# # laygo2 내부 사용 예시
# import os
# user = os.getenv("LAYGO_USERNAME", "guest")
# base = os.getenv("LAYGO_BASENAME", "noname")

# # 예: 사용자별 출력 디렉토리
# out_dir = f"/mnt/c/GraduationProject/temp_yaml/{user}"
# os.makedirs(out_dir, exist_ok=True)
# ====================================================================================================

# 로그 생성버전
# 로그 디렉토리 만들기
mkdir -p ./temp
LOG_FILE="./temp/${USERNAME}_${FILENAME}_output.log"
# 실행
echo "[INFO] 실행 중: $CODE_PATH" > "$LOG_FILE"
# 디버깅 로그
# echo "[DEBUG] Which python: $(which "$BAG_PYTHON")" >> "$LOG_FILE"
# echo "[DEBUG] Python version: $("$BAG_PYTHON" --version)" >> "$LOG_FILE"
# echo "[DEBUG] Laygo2_tech import test:" >> "$LOG_FILE"
# "$BAG_PYTHON" -c "import laygo2_tech; print('laygo2_tech import OK')" >> "$LOG_FILE" 2>&1
# echo " " >> "$LOG_FILE"
# echo " " >> "$LOG_FILE"
# echo " " >> "$LOG_FILE"
${BAG_PYTHON:-python3} "$CODE_PATH" >> "$LOG_FILE" 2>&1


# 로그 삭제버전
# ${BAG_PYTHON:-python3} "$CODE_PATH"

exit 0