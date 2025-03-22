const asyncHandler = require('express-async-handler');
const File = require('../models/fileModel');
const multer = require('multer');
const fs = require('fs');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { exec } = require('child_process');
const path = require('path');
const os = require('os');

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
    console.log(req.body);
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
//~~
    // 파일 타입이 디렉토리라면
    if (file.filetype === 'dir') {
        // 현재 경로를 쿼리 파라미터에서 가져오고, 없으면 기본값 '/' 사용
        // let currentPath = req.query.path || '/';
        // // console.log(currentPath)
        // // currentPath가 '/'로 끝나지 않으면 추가
        // if (!currentPath.endsWith('/')) {
        //     currentPath += '/';
        // }
        // 새 경로: 현재 경로 + 디렉토리 이름 + '/'
        const newPath = currentPath + file.filename + '/';
        // 메인 페이지로 리다이렉트 시 새 경로를 쿼리 파라미터로 전달
        return res.redirect('/main?path=' + encodeURIComponent(newPath));
    }
//~~
    // 파일 타입이 디렉토리가 아니라면 수정 페이지로 렌더링
    res.render('edit', { file: file, currentPath: currentPath });
});

// Save & Generate: PUT /main/:id/edit?_method=PUT&path=...
// const BAG_WORKSPACE_PATH = '/mnt/c/GraduationProject/bag_workspace_gpdk045';
// const SCRIPT_PATH = path.join(BAG_WORKSPACE_PATH, 'start_bag.sh');

const saveFile = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { content } = req.body;
  
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
  
      // 파이썬 코드 파일로 저장
      fs.writeFileSync(tempFileWin, content, 'utf8');
  
      // WSL 내 bash에서 start_bag.sh 실행
      const command = `wsl bash -c "bash /mnt/c/GraduationProject/bag_workspace_gpdk045/start_bag_test.sh ${username} ${filename} ${tempFileWSL}"`;
  
      exec(command, { shell: true }, (error, stdout, stderr) => {
        if (error) {
          console.error('실행 에러:', error);
          return res.status(500).json({ success: false, error: stderr });
        }
        return res.json({ success: true, output: stdout });
      });
    } else {
      res.json({ success: true });
    }
  });
  
  module.exports = {
    saveFile,
  };
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

module.exports = {
    getAllContacts, 
    createContact,
    getContact,
    updateContact,
    deleteContact,
    addContactForm,
    editFile,
    saveFile
    // ,
    // adddir,
    // createDir
};

