{BufferedProcess, CompositeDisposable} = require 'atom'
_ = require('underscore-plus')
fs = require 'fs'
path = require 'path'
treeViewPath = atom.packages.resolvePackagePath('tree-view')

################## TreeView files ##############################
DirectoryView = require "#{treeViewPath}/lib/directory-view"
Directory = require "#{treeViewPath}/lib/directory"
FileView = require "#{treeViewPath}/lib/file-view"
File = require "#{treeViewPath}/lib/file"
################################################################

class BundlerDirectory extends Directory
    preloadGems: ->
      @directories = []
      gems = []

      command = 'bundle'
      args = ['show', '--paths']
      options =
        cwd: @fullProjectPath
        env: process.env

      stdout = (output) =>
        # console.log(output)
        _.each output.split("\n"), (gemLine) =>
          match = gemLine.match('^.*\/(.*)-(.*)?')
          if match?
            gems.push {path: match[0], name: match[1], version: match[2]}

      stderr = (output) =>
        # TODO: display error message
        # console.log(output)

      exit = (code) =>
        if 0 == code
          gems.forEach (gem) =>
            @directories.push(new Directory({
              name: "#{gem.name} #{gem.version}",
              fullPath: gem.path,
              symlink: false,
              expansionState: {isExpanded: false},
              ignoredPatterns: []}))

      new BufferedProcess({command, args, options, stdout, stderr, exit})

    getEntries: ->
      @sortEntries(@directories)


class TreeViewBundlerView
  constructor: (fullProjectPath) ->
    @gnoredPaths = []

    directory = new BundlerDirectory({
      name: 'Bundled Gems'
      fullPath: ''
      symlink: false
      isRoot: true
      expansionState: {isExpanded: false}
      @ignoredPaths
      })

    directory.fullProjectPath = fullProjectPath
    directory.preloadGems()

    @view = new DirectoryView()
    @view.initialize(directory)

  getElement: ->
    @view

module.exports = TreeViewBundlerView
