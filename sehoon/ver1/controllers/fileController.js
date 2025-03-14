const asyncHandler = require('express-async-handler');
const File = require('../models/fileModel');


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


// add file
// GET  /add
const addContactForm = (req, res) => {
    const currentPath = req.query.path || '/';
    res.render('add', { currentPath: currentPath });
}

// add file
// GET  /add
// const adddir = (req, res) => {
//     // console.log(req.user);
//     res.render('add-directory');
// }

// save added file
// POST /add
const createContact = asyncHandler(async (req, res) => {
    const {filename, filetype} = req.body;
    if (!filename || !filetype){
        return res.send('essential data is not written');
    }
    const currentPath = req.query.path || '/';  //
    // console.log(currentPath)
    const file = await File.create({
        user: req.user.username, filename: filename, filetype: filetype, filePath: currentPath
    });

    res.redirect('/main?path=' + encodeURIComponent(currentPath));
});

// save added file
// POST /add
// const createDir = asyncHandler(async (req, res) => {
//     const {filename, filetype} = req.body;
//     if (!filename || !filetype){
//         return res.send('essential data is not written');
//     }
//         const file = await File.create({
//         user: req.user.username, filename: filename, filetype: filetype, filePath: "test"
//     });

//     res.redirect('/main');
// });

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



// save file
// PUT
const saveFile = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { content } = req.body;

    const file = await File.findById(id);
    if (!file) {
        return res.status(404).json({ error: 'File not found.' });
    }

    file.content = content;
    await file.save();
    res.json({ success: true });
});




module.exports = {
    getAllContacts, 
    createContact,
    getContact,
    updateContact,
    deleteContact,
    addContactForm,
    editFile,
    saveFile
    // , adddir,
    // createDir
};

