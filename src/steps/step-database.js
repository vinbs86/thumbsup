/*
--------------------------------------------------------------------------------
Provides most metadata based on the output of <exiftool>
Caches the resulting DB in <metadata.json> for faster re-runs
--------------------------------------------------------------------------------
*/

const debug = require('debug')('thumbsup')
const exifdb = require('exiftool-json-db')
const Observable = require('zen-observable')
const bar = require('./bar')

exports.run = function (media, databasePath, callback) {
  return new Observable(observer => {
    var count = 0
    var total = 0
    var emitter = null

    try {
      emitter = exifdb.create({media: media, database: databasePath})
    } catch (ex) {
      const message = [
        'Loading database',
        ex.toString(),
        'If migrating from thumbsup v1, delete <metadata.json> to rebuild the database from scratch'
      ]
      observer.error(new Error(message.join('\n')))
    }

    // once we know how many files need to be read
    emitter.on('stats', (stats) => {
      debug(`Database stats: total=${stats.total}`)
      total = stats.added + stats.modified
      reportProgress()
    })

    // after every file is read
    emitter.on('file', file => {
      ++count
      reportProgress()
    })

    // when finished
    emitter.on('done', files => {
      callback({database: files})
      setTimeout(() => observer.complete(), 300)
    })

    // on error
    emitter.on('error', err => observable.error(err))

    function reportProgress () {
      if (total === 0) return
      const progress = bar.percent(count, total)
      observer.next(`Updated ${count}/${total} files ${progress}`)
    }
  })
}
