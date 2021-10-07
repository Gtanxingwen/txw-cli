#!/usr/bin/env node

const webpack = require('webpack')
// 处理参数
const minimist = require('minimist')
const path = require('path')
const builtInWebpackConfig = require('../webpack.config')


const args = minimist(process.argv.slice(2))
// TODO: 内聚到 class PluginManager {}
const __commands = {}
const fname = 'zj.config.js'

const runWebpackBuild = () => {
    webpack(builtInWebpackConfig, (err, stats) => {
        if (err || stats.hasErrors()) {
            return console.log('build failed.')
        }
       
        console.log('build success.', args)
    })
}

// 封装 api
// TODO:内聚到 class Api extends BaseApi {}
const api = {
    registerCommands(name, impl) {
        const command = __commands[name]

        if (!command) {
            __commands[name] = impl
        }
    }
}

const readLocalOptions = () => new Promise((resolve) => {
    const config = require(path.join(process.cwd(), fname)) || {}

    const { plugins: { commands = [] } = {} } = config

    if (commands.length) {
        commands.forEach(command => {
            command(api)
        })
    }

    resolve(__commands)

})

readLocalOptions().then(commands => {
    console.log(args)
    const command = args._[0]
    if (commands[command]) {
        commands[command]()
    } else {
        runWebpackBuild()
    }
})