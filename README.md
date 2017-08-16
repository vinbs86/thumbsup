# thumbsup

[![NPM](http://img.shields.io/npm/v/thumbsup.svg?style=flat)](https://npmjs.org/package/thumbsup)
[![License](http://img.shields.io/npm/l/thumbsup.svg?style=flat)](https://github.com/thumbsup/thumbsup)
[![Travis CI](https://travis-ci.org/thumbsup/thumbsup.svg?branch=master)](https://travis-ci.org/thumbsup/thumbsup)
[![Dependencies](http://img.shields.io/david/thumbsup/thumbsup.svg?style=flat)](https://david-dm.org/thumbsup/thumbsup)
[![Dev dependencies](https://david-dm.org/thumbsup/thumbsup/dev-status.svg?style=flat)](https://david-dm.org/thumbsup/thumbsup?type=dev)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/)

![banner](banner.jpg)

Turn any folder with photos &amp; videos into a web gallery.

- thumbnails & multiple resolutions for fast previews
- mobile friendly website with customisable themes
- only rebuilds changed files: it's fast!
- uses relative paths so you can deploy the pages anywhere
- works great with Amazon S3 for static hosting

## Quick start

Simply point `thumbsup` to a folder with photos &amp; videos. All nested folders become separate albums.

*Requirements*
- [Node.js](http://nodejs.org/): `brew install Node`
- [exiftool](http://www.sno.phy.queensu.ca/~phil/exiftool/): `brew install exiftool`
- [GraphicsMagick](http://www.graphicsmagick.org/): `brew install graphicsmagick`
- [FFmpeg](http://www.ffmpeg.org/): `brew install ffmpeg`


```bash
npm install -g thumbsup
thumbsup --input ./media --output ./website
```

![Screenshot of output](output.png)

There are many more command line arguments to customise the output.
You can also run `thumbsup` as a Docker container which pre-packages all dependencies like `ffmpeg`.
See the website for the full documentation: https://thumbsup.github.io.

## Sample gallery

See a sample gallery online at https://thumbsup.github.io/demos/themes/mosaic/

![sample gallery](screenshot.png)

## Command line arguments

This reflects the CLI for the latest code on `master`.
For the latest published version please refer to the [docs on the website](https://thumbsup.github.io).

<!-- START cli -->
```

Usages:
  thumbsup [required] [options]
  thumbsup --config config.json

Required:
  --input   Path to the folder with all photos/videos  [string] [required]
  --output  Output path for the static website  [string] [required]

Output options:
  --thumb-size            Pixel size of the square thumbnails  [number] [default: 120]
  --large-size            Pixel height of the fullscreen photos  [number] [default: 1000]
  --download-photos       Target of the photo download links  [choices: "large", "copy", "symlink", "link"] [default: "large"]
  --download-videos       Target of the video download links  [choices: "large", "copy", "symlink", "link"] [default: "large"]
  --download-link-prefix  Path or URL prefix for linked downloads  [string]
  --cleanup               Remove any output file that's no longer needed  [boolean] [default: false]

Album options:
  --albums-from            How to group media into albums  [choices: "folders", "date"] [default: "folders"]
  --albums-date-format     How albums are named in <date> mode [moment.js pattern]  [default: "YYYY-MM"]
  --sort-albums-by         How to sort albums  [choices: "title", "start-date", "end-date"] [default: "start-date"]
  --sort-albums-direction  Album sorting direction  [choices: "asc", "desc"] [default: "asc"]
  --sort-media-by          How to sort photos and videos  [choices: "filename", "date"] [default: "date"]
  --sort-media-direction   Media sorting direction  [choices: "asc", "desc"] [default: "asc"]

Website options:
  --index                 Filename of the home page  [default: "index.html"]
  --albums-output-folder  Output subfolder for HTML albums (default: website root)  [default: "."]
  --theme                 Name of the gallery theme to apply  [choices: "classic", "cards", "mosaic"] [default: "classic"]
  --title                 Website title  [default: "Photo album"]
  --footer                Text or HTML footer  [default: null]
  --css                   Path to a custom provided CSS/LESS file for styling  [string]
  --google-analytics      Code for Google Analytics tracking  [string]

Deprecated:
  --original-photos  Copy and allow download of full-size photos  [boolean] [default: false]
  --original-videos  Copy and allow download of full-size videos  [boolean] [default: false]

Options:
  --help    Show help  [boolean]
  --config  Path to JSON config file  [string]

The optional JSON config should contain a single object with one key per argument, not including the leading "--". For example:

{ "sort-albums-by": "start-date" }

```

<!-- END cli -->

## Contributing

We welcome all [issues](https://github.com/thumbsup/thumbsup/issues)
and [pull requests](https://github.com/thumbsup/thumbsup/pulls)!

If you are facing any issues or getting crashes, you can run `thumbsup` in debug mode
to get a verbose troubleshooting log of all operations:

```bash
DEBUG="*" thumbsup [options]
```

Please make sure the tests are passing when submitting a code change:

```bash
./scripts/cibuild
```
