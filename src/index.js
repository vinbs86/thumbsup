const fs = require('fs-extra')
const path = require('path')
const Observable = require('zen-observable')
const Listr = require('listr')
const ListrMultilineRenderer = require('listr-multiline-renderer')
const steps = require('./steps/index')
const summary = require('./steps/summary')
const website = require('./output-website/website')

exports.build = function (opts) {

  const tasks = new Listr([
    {
  		title: 'Updating database',
      task: (ctx, task) => {
        fs.mkdirpSync(opts.output)
        const databaseFile = path.join(opts.output, 'metadata.json')
        return steps.database(opts.input, databaseFile, res => {
          ctx.database = res.database
        })
      }
    },
    {
  		title: 'Creating model',
      task: (ctx) => {
        const res = steps.model(ctx.database, opts)
        ctx.files = res.files
        ctx.album = res.album
      }
    },
    {
      title: 'Processing photos',
      task: (ctx) => {
        return steps.process(opts, ctx.files, 'image')
      }
    },
    {
      title: 'Processing videos',
      task: (ctx) => {
        return steps.process(opts, ctx.files, 'video')
      }
    },
    {
      title: 'Cleaning up',
      enabled: (ctx) => !opts.cleanup,
      task: (ctx) => {
        steps.cleanup(ctx.files, opts.output)
      }
    },
    {
      title: 'Creating website',
      task: (ctx) => new Promise((resolve, reject) => {
        website.build(ctx.album, opts, err => {
          err ? reject(err) : resolve()
        })
      })
    }
  ], {
    renderer: ListrMultilineRenderer
  })

  tasks.run().then(ctx => {
    console.log('\n' + summary.create(ctx) + '\n')
    process.exit(0)
  }).catch(err => {
    console.log('\nUnexpected error', err)
    process.exit(1)
  })
}
