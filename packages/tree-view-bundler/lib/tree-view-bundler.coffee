{CompositeDisposable} = require 'atom'
TreeViewBundlerView = require './tree-view-bundler-view'
fs = require 'fs'

module.exports = TreeViewBundler =
  treeView: null
  subscriptions: null

  activate: (state) ->
    @subscriptions = new CompositeDisposable

    atom.packages.activatePackage('tree-view').then (treeViewPkg) =>
      @treeView = treeViewPkg.mainModule.createView()
      @subscribeUpdateEvents()
      @update()

    .catch (error) ->
      console.error error, error.stack

    # Register command that updates this view
    @subscriptions.add atom.commands.add 'atom-workspace', 'tree-view-bundler:update': => @update()

  deactivate: ->
    @subscriptions.dispose()
    if @treeView?
      @clearRoots(@treeView.roots)
    @subscriptions = null
    @treeView = null

  serialize: ->

  update: ->
    return unless @treeView

    @treeView.roots.forEach (root) ->
      fs.exists "#{root.getPath()}/Gemfile", (exists) =>
        if exists
          bundlerView = new TreeViewBundlerView(root.getPath())
          root.entries.appendChild(bundlerView.getElement())

  subscribeUpdateEvents: ->
    @subscriptions.add atom.project.onDidChangePaths =>
      @update()
