filename = "test_output.txt"

# 1. 파일에 문자열 쓰기
with open(filename, "w", encoding="utf-8") as f:
    f.write("이것은 테스트 파일입니다.\n")
    f.write("파이썬이 성공적으로 실행되었습니다~!!!\n")

# 2. 파일 내용 읽어서 출력
with open(filename, "r", encoding="utf-8") as f:
    contents = f.read()

print("📄 파일 내용:")
print(contents)
