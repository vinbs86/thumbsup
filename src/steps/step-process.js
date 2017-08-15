const async = require('async')
const os = require('os')
const fs = require('fs-extra')
const path = require('path')
const debug = require('debug')('thumbsup')
const downsize = require('thumbsup-downsize')
const Observable = require('zen-observable')
const tasks = require('../output-media/tasks')
const bar = require('./bar')

exports.run = function (opts, files, fileType) {
  const actions = exports.create(opts, files, fileType)
  return new Observable(observer => {
    var count = 0
    const current = {}
    function updateProgress () {
      var progress = bar.percent(count, actions.length)
      var message = `Processed ${count}/${actions.length} files ${progress}`
      Object.keys(current).forEach(absoluteDest => {
        const relative = path.relative(opts.output, absoluteDest)
        return message += `\n${relative} ${current[absoluteDest]}`
      })
      observer.next(message)
    }
    const decorated = actions.map(t => done => {
      current[t.dest] = ''
      var progressEmitter = t.action(err => {
        ++count
        delete current[t.dest]
        updateProgress()
        done(err)
      })
      if (progressEmitter) {
        progressEmitter.on('progress', (percent) => {
          current[t.dest] = `(${percent}%)`
          updateProgress()
        })
      }
    })
    async.parallelLimit(decorated, os.cpus().length, err => {
      if (err) return observer.error(err)
      setTimeout(() => observer.complete(), 300)
    })
  })
}


/*
  Return a list of task to build all required outputs (new or updated)
  Can be filtered by type (image/video) to give more accurate ETAs
*/
exports.create = function (opts, files, filterType) {
  var tasks = {}
  const actionMap = getActionMap(opts)
  // accumulate all tasks into an object
  // to remove duplicate destinations
  files.filter(f => f.type === filterType).forEach(f => {
    debug(`Tasks for ${f.path}, ${JSON.stringify(f.output)}`)
    Object.keys(f.output).forEach(out => {
      var src = path.join(opts.input, f.path)
      var dest = path.join(opts.output, f.output[out].path)
      var destDate = modifiedDate(dest)
      var action = actionMap[f.output[out].rel]
      // ignore output files that don't have an action (e.g. existing links)
      if (action && f.date > destDate) {
        tasks[dest] = (done) => {
          fs.mkdirsSync(path.dirname(dest))
          debug(`${f.output[out].rel} from ${src} to ${dest}`)
          return action({src: src, dest: dest}, done)
        }
      }
    })
  })
  // back into an array
  const list = Object.keys(tasks).map(dest => {
    return { dest: dest, action: tasks[dest] }
  })
  debug(`Created ${list.length} ${filterType} tasks`)
  return list
}

function modifiedDate (filepath) {
  try {
    return fs.statSync(filepath).mtime.getTime()
  } catch (ex) {
    return 0
  }
}

function getActionMap (opts) {
  const thumbSize = opts.thumbSize || 120
  const largeSize = opts.largeSize || 1000
  const thumbnail = { height: thumbSize, width: thumbSize }
  const large = { width: largeSize }
  return {
    'fs:copy': (task, done) => fs.copy(task.src, task.dest, done),
    'fs:symlink': (task, done) => fs.symlink(task.src, task.dest, done),
    'photo:thumbnail': (task, done) => downsize.image(task.src, task.dest, thumbnail, done),
    'photo:large': (task, done) => downsize.image(task.src, task.dest, large, done),
    'video:thumbnail': (task, done) => downsize.still(task.src, task.dest, thumbnail, done),
    'video:poster': (task, done) => downsize.still(task.src, task.dest, large, done),
    'video:resized': (task, done) => downsize.video(task.src, task.dest, {}, done)
  }
}
