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
    const command = `wsl bash -c "bash /mnt/c/GraduationProject/bag_workspace_gpdk045/start_bag_test.sh ${username} ${filename} ${tempFileWSL}"`;

    exec(command, { shell: true }, (error, stdout, stderr) => {
      fs.unlink(tempFileWin, (unlinkErr) => {
          if (unlinkErr) {
            console.error("임시 파일 삭제 실패:", unlinkErr);
          } 
          // else {
          //   console.log("임시 파일 삭제 완료");
          // }
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
        doc = yaml.load(fs.readFileSync(tempDir_y_u_yaml, 'utf8')); 
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

// save file
// PUT
// const saveFile = asyncHandler(async (req, res) => {
//     const id = req.params.id;
//     const { content } = req.body;

//     const file = await File.findById(id);
//     if (!file) {
//         return res.status(404).json({ error: 'File not found.' });
//     }

//     file.content = content;
//     await file.save();
//     res.json({ success: true });
// });

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
    getLogFile
    // ,
    // adddir,
    // createDir
};

