TreeViewBundler = require '../lib/tree-view-bundler'

# Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
#
# To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
# or `fdescribe`). Remove the `f` to unfocus the block.

describe "TreeViewBundler", ->
  [workspaceElement, activationPromise] = []

  beforeEach ->
    workspaceElement = atom.views.getView(atom.workspace)
    activationPromise = atom.packages.activatePackage('tree-view-bundler')

  describe "when the tree-view-bundler:update event is triggered", ->
    it "shows bundler as folder and gems for it", ->

    it "hides unused unlisted gems", ->
