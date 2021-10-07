// 用户需要支持 clean 命令
module.exports = (options) => (api) => {
    console.log('options ', options)
    api.registerCommands('clean', (...args) => {
        // clean 命令逻辑
        console.log('exec clean script success.')
    })
}