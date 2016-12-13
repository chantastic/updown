const cons = require("consolidate")
const fs = require("fs")
const path = require("path")
const { walk } = require("file")
const marked = require("marked")
const pygmentize = require("pygmentize-bundled")

const readme = fs.readFileSync("./README.md", "utf8")

marked.setOptions({
  smartypants: true,
  highlight: (code, lang, callback) => (
    pygmentize(
      { lang: lang, format: 'html' },
      code,
      (err, result) => callback(err, result.toString())
    )
  )
})

walk(
  "./",
  (_,dir) => (
    dir.match(/^(.git|node_modules)/) || fs.stat(
      path.join(dir, "README.md"),
      (err) => {
        if (!err) marked(fs.readFileSync(path.join(dir, "README.md"), "utf8"), (err, content) => {
          if (err) throw err
          cons["lodash"](
            "_layout.html",
            {content},
            (err, html) => {
              if (err) throw err;
              fs.writeFileSync(path.join(dir, "index.html"), html)
            }
          )
        })
      }
    )
  )
)
