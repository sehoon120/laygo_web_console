const asyncHandler = require('express-async-handler');
const File = require('../models/fileModel');
const multer = require('multer');
const fs = require('fs');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { exec } = require('child_process');
const path = require('path');
const os = require('os');

const tempYamlDir = path.join(__dirname, '../../temp_yaml');
const yaml = require('js-yaml');
const { spawn } = require('child_process');

// ==================================================

const getAllContacts = asyncHandler(async (req, res) => {
    const currentPath = req.query.path || '/';  //
    
    File.find({ 
        user: req.user.username
        , filePath: currentPath //
    })
    .sort({ updatedAt: -1 })  // updatedAt 필드를 기준으로 내림차순 정렬
    .then(files => {
        res.render('getallfiles', { files, currentPath });
    })
    .catch(err => {
        console.error(err);
        res.status(500).send('파일 데이터를 불러오는 중 오류가 발생했습니다.');
    });
});

// ==================================================

// add file
// GET  /add
const addContactForm = (req, res) => {
    const currentPath = req.query.path || '/';
    res.render('add', { currentPath: currentPath });
}

// save added file
// POST /add
// const createContact = asyncHandler(async (req, res) => {
//     const {filename, filetype} = req.body;
//     if (!filename || !filetype){
//         return res.send('essential data is not written');
//     }
//     const currentPath = req.query.path || '/';  //
//     // console.log(currentPath)
//     const file = await File.create({
//         user: req.user.username, filename: filename, filetype: filetype, filePath: currentPath
//     });

//     res.redirect('/main?path=' + encodeURIComponent(currentPath));
// });


const createContact = asyncHandler(async (req, res) => {
    const { filename, filetype } = req.body;
    // console.log(req.body);
    if (!filename || !filetype) {
        return res.send('essential data is not written');
    }
    const currentPath = req.query.path || '/';
    // 기본 파일 데이터를 구성합니다.
    let fileData = {
        user: req.user.username,
        filename: filename,
        filetype: filetype,
        filePath: currentPath
    };
    // 파일 업로드가 있는 경우 파일 내용을 읽어옵니다.
    if (req.file) {
        // 메모리 스토리지를 사용하는 경우 req.file.buffer가 존재합니다.
        if (req.file.buffer) {
            fileData.content = req.file.buffer.toString('utf8');
        }
        // 디스크 스토리지를 사용하는 경우 파일 경로를 통해 읽어옵니다.
        else if (req.file.path) {
            fileData.content = fs.readFileSync(req.file.path, 'utf8');
        }
    }
    const file = await File.create(fileData);
    res.redirect('/main?path=' + encodeURIComponent(currentPath));
});

// ==================================================

// change file
// GET  /:id
const getContact = asyncHandler(async (req, res) => {
    const file = await File.findById(req.params.id);
    const currentPath = req.query.path || '/';
    res.render('update', { file: file, currentPath: currentPath});

});

// change file name
// PUT
// const updateContact = asyncHandler(async (req, res) => {
//     const id = req.params.id;
//     const {name, type, path} = req.body;
//     const currentPath = req.query.path || '/';
//     const file = await File.findById(id);
//     if (!file) {
//         throw new Error('File not found.');
//     }

//     file.filename = name;
//     file.filetype = type;
//     file.filePath = path;
//     file.save();
//     res.redirect('/main?path=' + encodeURIComponent(currentPath));
// });


// change file name
// PUT
const updateContact = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { name, type, path } = req.body;
    const currentPath = req.query.path || '/';
    const file = await File.findById(id);
    if (!file) {
        throw new Error('File not found.');
    }

    // 디렉토리일 경우, 하위 파일 및 디렉토리 경로 업데이트 (현재 사용자와 관련된 파일만)
    if (file.filetype === 'dir') {
        // 기존 디렉토리의 전체 경로 (예: '/4/train/test_dir/')
        const oldDirFullPath = file.filePath + file.filename + '/';
        // 새 이름으로 변경 후 전체 경로 (예: '/4/train/abcd/')
        const newDirFullPath = file.filePath + name + '/';

        // 현재 로그인한 사용자(req.user.username)에 해당하는 하위 파일/디렉토리만 업데이트
        const children = await File.find({
            filePath: { $regex: '^' + oldDirFullPath },
            user: req.user.username
        });
        for (let child of children) {
            child.filePath = child.filePath.replace(oldDirFullPath, newDirFullPath);
            await child.save();
        }
    }

    // 현재 파일 또는 디렉토리 업데이트
    file.filename = name;
    file.filetype = type;
    file.filePath = path;
    await file.save();
    res.redirect('/main?path=' + encodeURIComponent(currentPath));
});





// delete file
// DEL
const deleteContact = asyncHandler(async (req, res) => {
    // console.log(req.params.id)
    const id = req.params.id;
    await File.findByIdAndDelete(id);
    const currentPath = req.query.path || '/';
    res.redirect('/main?path=' + encodeURIComponent(currentPath));

});

// ==================================================

// edit file
// GET
const editFile = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const file = await File.findById(id);
    const currentPath = req.query.path || '/';
    const userDir = path.join(tempYamlDir, req.user.username);

    // 파일 타입이 디렉토리라면
    if (file.filetype === 'dir') {
        const newPath = currentPath + file.filename + '/';
        // 메인 페이지로 리다이렉트 시 새 경로를 쿼리 파라미터로 전달
        return res.redirect('/main?path=' + encodeURIComponent(newPath));
    }

    // 파일 타입이 디렉토리가 아니라면 수정 페이지로 렌더링
    res.render('edit', { file: file, currentPath: currentPath, drawObjectDoc: {}, cellname: 'dummyCell' });
});

// Save & Generate: PUT /main/:id/edit?_method=PUT&path=...
// const BAG_WORKSPACE_PATH = '/mnt/c/GraduationProject/bag_workspace_gpdk045';
// const SCRIPT_PATH = path.join(BAG_WORKSPACE_PATH, 'start_bag.sh');

/*
const saveFile = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { content } = req.body;
  
  const userDir = path.join(tempYamlDir, req.user.username);

  const file = await File.findById(id);
  if (!file) {
    return res.status(404).json({ error: 'File not found.' });
  }

  // 1. 파일 내용 저장
  file.content = content;
  await file.save();

  // 2. filetype이 py일 때 실행
  if (file.filetype === 'py') {
    const username = req.user.username // || 'alpha'; // 유저명 없으면 fallback
    const filename = file.filename.replace(/\.[^/.]+$/, ""); // 확장자 제거

    const tempDir = path.join(__dirname, '../../temp_code');
    const tempFileWin = path.join(tempDir, `${username}_${filename}_temp.py`);
    const tempFileWSL = `/mnt/${tempFileWin[0].toLowerCase()}/${tempFileWin.slice(3).replace(/\\/g, '/')}`;
    //Added by me
    const runDirWin = path.join(__dirname, '..');
    const runDirWsl = `/mnt/${runDirWin[0].toLowerCase()}/${runDirWin.slice(3).replace(/\\/g, '/')}`;
    // temp 디렉토리 없으면 생성
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const tempDir_y = path.join(__dirname, '../../temp_yaml');
    // temp_yaml 디렉토리 없으면 생성
    if (!fs.existsSync(tempDir_y)) fs.mkdirSync(tempDir_y, { recursive: true });

    const tempDir_y_u = path.join(__dirname, '../../temp_yaml', username);
    // temp_yaml_username 디렉토리 없으면 생성
    if (!fs.existsSync(tempDir_y_u)) fs.mkdirSync(tempDir_y_u, { recursive: true });

    const yaml_name = req.body.yamlFile ? `${req.body.yamlFile}_templates.yaml` : 'logic_generated_templates.yaml';
    const lib = req.body.yamlFile ? req.body.yamlFile : 'logic_generated';
    const tempDir_y_u_yaml = path.join(tempDir_y_u, yaml_name);

    // 파이썬 코드 파일로 저장
    fs.writeFileSync(tempFileWin, content, 'utf8');

    // WSL 내 bash에서 start_bag.sh 실행
    const command = `wsl csh -c "cd /mnt/c/For_english_only_directories/LaygoWebConsole/bag_workspace_gpdk045; source .cshrc_bag; bash /mnt/c/For_english_only_directories/LaygoWebConsole/bag_workspace_gpdk045/start_bag_test.sh ${username} ${filename} ${tempFileWSL} ${runDirWsl}"`;
    
    exec(command, { shell: true }, (error, stdout, stderr) => {
      fs.unlink(tempFileWin, (unlinkErr) => {
          if (unlinkErr) {
            console.error("임시 파일 삭제 실패:", unlinkErr);
          } 
          else {
             console.log("임시 파일 삭제 완료");
          }
      });
      fs.readdir(tempDir_y_u, (err, files) => {
        if (err) {
          console.error('temp_yaml 폴더 읽기 에러:', err);
          return;
        }
      
        files.forEach(yamlFile => {
          // YAML 파일만 처리 (확장자가 .yaml 혹은 .yml 인 파일)
          if (yamlFile.endsWith('.yaml') || yamlFile.endsWith('.yml')) {
            const filePath = path.join(tempDir_y_u, yamlFile);
            fs.readFile(filePath, 'utf8', async (err, data) => {
              if (err) {
                console.error(`파일 ${yamlFile} 읽기 에러:`, err);
                return;
              }
              try {
                // 확장자 제거 (예: logic_generated_templates.yaml -> logic_generated_templates)
                const filenameWithoutExt = yamlFile.replace(/\.[^/.]+$/, "");
                // 파일의 고유 식별자를 user, filename, filetype, filePath 조합으로 가정
                const fileQuery = {
                  user: username,
                  filename: filenameWithoutExt,
                  filetype: 'yaml',
                  filePath: req.query.path || '/'
                };
      
                let fileData = {
                  user: username,
                  filename: filenameWithoutExt,
                  content: data,
                  filetype: 'yaml',
                  filePath: req.query.path || '/'
                };
      
                // 기존에 파일이 있는지 검색
                const existingFile = await File.findOne(fileQuery);
      
                if (existingFile) {
                  // 파일이 이미 있다면 내용 업데이트
                  existingFile.content = data;
                  await existingFile.save();
                  // console.log(`${filenameWithoutExt} 데이터베이스 업데이트 완료`);
                } else {
                  // 없으면 새로 생성
                  await File.create(fileData);
                  // console.log(`${filenameWithoutExt} 데이터베이스 저장 완료`);
                }
      
                // 저장 후 파일 삭제 (원하지 않으면 이 부분은 제거)
                // fs.unlink(filePath, unlinkErr => {
                //   if (unlinkErr) {
                //     console.error(`${yamlFile} 삭제 에러:`, unlinkErr);
                //   } else {
                //     console.log(`${yamlFile} 파일 삭제 완료`);
                //   }
                // });
              } catch (dbErr) {
                console.error('DB 저장 에러:', dbErr);
              }
            });
          }
        });
      });




      if (error) {
        console.error('실행 에러:', error);
        return res.status(500).json({ success: false, error: stderr });
      }
      let doc;
      try {
        //doc = yaml.load(fs.readFileSync(tempDir_y_u_yaml, 'utf8')); 
        doc = yaml.load(fs.readFileSync('C:\For_english_only_directories\LaygoWebConsole\laygo_web_console\jeyun\temp_yaml\jeyunp\test\test_logic\inv_2x.yaml', 'utf8')); 
        // console.info(doc);
     } catch (e) {
        console.error(e);
     }
      return res.json({ success: true, output: stdout, drawObjectDoc: doc, cellname: req.body.cellname, libname: lib });
    });
  } else {
    res.json({ success: true });
  }
});
*/

//===============================================
//New version of saveFile and drawLayout function
const saveFile = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { content, generate } = req.body;

  const file = await File.findById(id);
  if (!file) {
    return res.status(404).json({ error: 'File not found.' });
  }

  // 0) 항상 먼저 저장
  file.content = content;
  await file.save();

  // generate 스위치가 꺼져있으면 여기서 종료 (일관된 응답 필드)
  if (generate !== 'on') {
    return res.json({
      success: true,
      message: 'Saved only (no generation)',
      output: '',
      drawObjectDoc: null,
      cellname: req.body.cellname ?? null,
      libname: null,
    });
  }

  // 1) 준비 -> temp_code, temp_yaml dir 생성: laygo에서의 기능과 겹치기도 함. 둘 중 하나 제거 가능
  const username = (req.user && req.user.username) ? req.user.username : 'guest';
  const baseName = file.filename.replace(/\.[^/.]+$/, ''); // 확장자 제거
  const tempCodeDir = path.join(__dirname, '../../temp_code');
  const tempYamlRoot = path.join(__dirname, '../../temp_yaml');
  if (!fs.existsSync(tempCodeDir)) fs.mkdirSync(tempCodeDir, { recursive: true });

  // 임시 코드 파일(Windows 경로)
  const tempFileWin = path.join(tempCodeDir, `${username}_${baseName}_temp.py`);
  fs.writeFileSync(tempFileWin, content, 'utf8');

  // WSL 경로로 변환 (드라이브 자동 추출)
  const drive = tempFileWin[0].toLowerCase(); // e.g., 'c'
  const rest = tempFileWin.slice(3).replace(/\\/g, '/'); // 'path/to/file.py'
  const tempFileWSL = `/mnt/${drive}/${rest}`;

  // YAML 경로 설정
  if (!fs.existsSync(tempYamlRoot)) fs.mkdirSync(tempYamlRoot, { recursive: true });
  const userYamlDir = path.join(tempYamlRoot, username);
  if (!fs.existsSync(userYamlDir)) fs.mkdirSync(userYamlDir, { recursive: true });

  const yamlBase = req.body.yamlFile ? `${req.body.yamlFile}_templates.yaml` : 'logic_generated_templates.yaml';
  const libname = req.body.yamlFile ? req.body.yamlFile : 'logic_generated';
  const targetYamlPath = path.join(userYamlDir, yamlBase); // 우리가 우선적으로 읽으려는 파일
  console.log("targetYamlPath");
  console.log(targetYamlPath);
  console.log("tempfilewin");
  console.log(tempFileWin);
  console.log("userYamlDir");
  console.log(userYamlDir);
  console.log("req.query.path");
  console.log(req.query.path);

  //Added by me
  const runDirWin = path.join(__dirname, '..');
  const runDirWsl = `/mnt/${runDirWin[0].toLowerCase()}/${runDirWin.slice(3).replace(/\\/g, '/')}`;

  // 2) WSL 스크립트 실행 (spawn 권장)
  runDirWsl_repl = runDirWsl.replace(/"/g, '\\"');
  const scriptWSL = `/mnt/c/For_english_only_directories/LaygoWebConsole/bag_workspace_gpdk045/start_bag_test.sh`;
  const cmd = 'wsl';
  // -lc: 로그인 쉘 + 명령 문자열, 인자에 공백 안전하게 따옴표
  const args = [
    'bash', '-lc',
    `"${scriptWSL}" "${username.replace(/"/g, '\\"')}" "${baseName.replace(/"/g, '\\"')}" "${tempFileWSL.replace(/"/g, '\\"')}" "${runDirWsl_repl}"`
  ];
  const child = spawn(cmd, args, { shell: false });

  let stdout = '';
  let stderr = '';
  child.stdout.on('data', (d) => { stdout += d.toString(); });
  child.stderr.on('data', (d) => { stderr += d.toString(); });

  child.on('close', async (code) => {
    // 임시 파일 제거 (실패해도 진행)
    fs.unlink(tempFileWin, () => {});
    if (code !== 0) {
      console.log(`Process exited with code ${code}`);
      return res.status(500).json({ success: false, error: stderr || `Process exited with code ${code}` });
    }

    // 3) user 폴더 내 YAML들 스캔하여 DB upsert (끝까지 보장)
    let yamlFiles = [];
    try {
      yamlFiles = fs.readdirSync(userYamlDir)
        .filter(f => f.endsWith('.yaml') || f.endsWith('.yml'))
        .map(f => path.join(userYamlDir, f));
    } catch (e) {
      // 폴더 읽기 실패 시 계속
    }

    try {
      await Promise.all(yamlFiles.map(async (ypath) => {
        const data = await fs.promises.readFile(ypath, 'utf8');
        const filenameWithoutExt = path.basename(ypath).replace(/\.[^/.]+$/, "");
        console.log("filenameWithoutExt");
        console.log(filenameWithoutExt);
        const fileQuery = {
          user: username,
          filename: filenameWithoutExt,
          filetype: 'yaml',
          filePath: req.query.path || '/'
        };

        const existing = await File.findOne(fileQuery);
        if (existing) {
          existing.content = data;
          await existing.save();
        } else {
          await File.create({
            ...fileQuery,
            content: data
          });
        }
      }));
    } catch (dbErr) {
      // DB 저장 실패해도 drawObjectDoc만이라도 리턴
      // 필요하면 여기서 로그만 남기고 계속 진행
      console.error('DB 저장 에러:', dbErr);
    }

    // 4) 최종 doc 로드 (타겟 YAML 우선)
    let doc = null;
    if (fs.existsSync(targetYamlPath)) {
      try {
        doc = yaml.load(fs.readFileSync(targetYamlPath, 'utf8'));
      } catch (e) {
        // YAML 파싱 실패 시 null 유지
        console.error('4번에러');
      }
    }

    return res.json({
      success: true,
      output: stdout,
      drawObjectDoc: doc,
      cellname: req.body.cellname ?? null,
      libname
    });
  });
});


// ==================================================

const getLogFile = asyncHandler(async (req, res) => {
  const username = req.user && req.user.username;
  const id = req.params.id;
  const file = await File.findById(id);
  if (!file) {
    return res.status(404).json({ error: 'File not found.' });
  }
  
  // file.filetype이 'py'가 아니면 빈 로그 반환
  if (file.filetype !== 'py') {
    return res.json({ log: '' });
  }

  const filename = file.filename;
  const logFilePath = path.join(__dirname, '../temp', `${username}_${filename}_output.log`);

  try {
    const data = await fs.promises.readFile(logFilePath, 'utf8');
    res.json({ log: data });
  } catch (err) {
    console.error("로그 파일 읽기 에러:", err);
    res.status(500).json({ error: '로그 파일을 읽을 수 없습니다.' });
  }
});

// ====================================================================================================

// utils: 파이썬 코드에서 lib/cell 추출
function extractLibCellFromPy(pyContent) {
  const src =
    Buffer.isBuffer(pyContent) ? pyContent.toString('utf8') :
    (typeof pyContent === 'string' ? pyContent : '');

  if (!src) return { lib: null, cell: null };

  const rxLib  = /libname\s*=\s*['"]([^'"]+)['"]/;
  const rxCell = /cellname\s*=\s*['"]([^'"]+)['"]/;
  const rxType = /cell_type\s*=\s*['"]([^'"]+)['"]/;
  const rxNf   = /nf\s*=\s*([0-9]+)/;

  let lib  = (src.match(rxLib)?.[1])  || null;
  let cell = (src.match(rxCell)?.[1]) || null;

  if (!cell) {
    const t = src.match(rxType)?.[1];
    const n = src.match(rxNf)?.[1];
    if (t && n) cell = `${t}_${n}x`;
  }
  return { lib, cell };
}


function pickFirstLibCellFromYamlDoc(doc) {
  if (!doc || typeof doc !== 'object') return { lib: null, cell: null };
  const libs = Object.keys(doc);
  if (!libs.length) return { lib: null, cell: null };
  const lib = libs[0];
  const cells = Object.keys(doc[lib] || {});
  const cell = cells.length ? cells[0] : null;
  return { lib, cell };
}

// 컨트롤러(draw 전용)
const drawLayout = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const file = await File.findById(id);
  if (!file) return res.status(404).json({ error: 'File not found.' });

  // 1) 사용자 입력
  let lib = (req.body.libname || req.body.yamlFile || '').trim() || null;
  let cell = (req.body.cellname || '').trim() || null;

  // 2) 없으면 파이썬 코드에서 추출
  if (!lib || !cell) {
    const { lib: l2, cell: c2 } = extractLibCellFromPy(file.content || '');
    lib = lib || l2;
    cell = cell || c2;
  }

  cell = cell + '.yaml';

  // 3) YAML 읽기 (네가 이미 만든 유저별 temp_yaml/username/.. 구조)
  const username = req.user?.username || 'guest';
  const userYamlDir = path.join(__dirname, '../../temp_yaml', username);
  const targetYaml = path.join(userYamlDir, lib, cell);
  print(targetYaml)

  // 가장 최근 yaml 선택
  /*let targetYaml = null;
  try {
    const yamlFiles = fs.readdirSync(userYamlDir)
      .filter(f => f.endsWith('.yaml') || f.endsWith('.yml'))
      .map(f => path.join(userYamlDir, f))
      .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
    targetYaml = yamlFiles[0] || null;
  } catch {}*/

  let doc = null;
  if (targetYaml && fs.existsSync(targetYaml)) {
    try { doc = yaml.load(fs.readFileSync(targetYaml, 'utf8')); } catch {}
  }

  // 4) 그래도 비었으면 YAML에서 첫 lib/cell 고름
  // if ((!lib || !cell) && doc) {
  //   const { lib: l3, cell: c3 } = pickFirstLibCellFromYamlDoc(doc);
  //   lib = lib || l3;
  //   cell = cell || c3;
  // }
  if ((!lib || !cell) && !doc) {  // 추출 못하면 그냥 출력 안하기
    return res.status(400).json({ success:false, message:'libname/cellname 미지정. 먼저 Save+Generate 하거나 값을 입력하세요.' });
  }

  // 5) 응답
  return res.json({
    success: !!doc,
    drawObjectDoc: doc,
    resolvedLibname: lib || null,
    resolvedCellname: cell || null,
    sourceYamlPath: targetYaml || null
  });
});


// ==================================================

module.exports = {
    getAllContacts, 
    createContact,
    getContact,
    updateContact,
    deleteContact,
    addContactForm,
    editFile,
    saveFile,
    getLogFile,
    drawLayout
    // ,
    // adddir,
    // createDir
};

