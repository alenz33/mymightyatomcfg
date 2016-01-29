(function() {
  describe('Bottom Container', function() {
    var BottomContainer, bottomContainer, trigger;
    BottomContainer = require('../../lib/ui/bottom-container');
    bottomContainer = null;
    trigger = require('../common').trigger;
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.packages.activatePackage('linter').then(function() {
          if (bottomContainer != null) {
            bottomContainer.dispose();
          }
          return bottomContainer = BottomContainer.create('File');
        });
      });
    });
    describe('::getTab', function() {
      return it('returns HTMLElements of tabs', function() {
        expect(bottomContainer.getTab('File') instanceof HTMLElement).toBe(true);
        expect(bottomContainer.getTab('Line') instanceof HTMLElement).toBe(true);
        expect(bottomContainer.getTab('Project') instanceof HTMLElement).toBe(true);
        return expect(bottomContainer.getTab('a') instanceof HTMLElement).toBe(false);
      });
    });
    describe('::setCount', function() {
      return it('updates count on underlying HTMLElements', function() {
        bottomContainer.setCount({
          Project: 1,
          File: 2,
          Line: 3
        });
        bottomContainer.iconScope = 'File';
        expect(bottomContainer.getTab('Project').count).toBe(1);
        expect(bottomContainer.getTab('File').count).toBe(2);
        return expect(bottomContainer.getTab('Line').count).toBe(3);
      });
    });
    describe('::{set, get}ActiveTab', function() {
      return it('works', function() {
        expect(bottomContainer.getTab('File').active).toBe(true);
        expect(bottomContainer.getTab('Line').active).toBe(false);
        expect(bottomContainer.getTab('Project').active).toBe(false);
        expect(bottomContainer.activeTab).toBe('File');
        bottomContainer.activeTab = 'Line';
        expect(bottomContainer.getTab('File').active).toBe(false);
        expect(bottomContainer.getTab('Line').active).toBe(true);
        expect(bottomContainer.getTab('Project').active).toBe(false);
        expect(bottomContainer.activeTab).toBe('Line');
        bottomContainer.activeTab = 'Project';
        expect(bottomContainer.getTab('File').active).toBe(false);
        expect(bottomContainer.getTab('Line').active).toBe(false);
        expect(bottomContainer.getTab('Project').active).toBe(true);
        expect(bottomContainer.activeTab).toBe('Project');
        bottomContainer.activeTab = 'File';
        expect(bottomContainer.activeTab).toBe('File');
        expect(bottomContainer.getTab('File').active).toBe(true);
        expect(bottomContainer.getTab('Line').active).toBe(false);
        return expect(bottomContainer.getTab('Project').active).toBe(false);
      });
    });
    describe('::{get, set}Visibility', function() {
      return it('manages element visibility', function() {
        bottomContainer.visibility = false;
        expect(bottomContainer.visibility).toBe(false);
        expect(bottomContainer.hasAttribute('hidden')).toBe(true);
        bottomContainer.visibility = true;
        expect(bottomContainer.visibility).toBe(true);
        return expect(bottomContainer.hasAttribute('hidden')).toBe(false);
      });
    });
    describe('::onDidChangeTab', function() {
      return it('is triggered when tab is changed', function() {
        var listener;
        listener = jasmine.createSpy('onDidChangeTab');
        bottomContainer.onDidChangeTab(listener);
        trigger(bottomContainer.getTab('File'), 'click');
        expect(listener).not.toHaveBeenCalled();
        trigger(bottomContainer.getTab('Project'), 'click');
        expect(listener).toHaveBeenCalledWith('Project');
        trigger(bottomContainer.getTab('File'), 'click');
        expect(listener).toHaveBeenCalledWith('File');
        trigger(bottomContainer.getTab('Line'), 'click');
        return expect(listener).toHaveBeenCalledWith('Line');
      });
    });
    describe('::onShouldTogglePanel', function() {
      return it('is triggered when active tab is clicked', function() {
        var listener;
        listener = jasmine.createSpy('onShouldTogglePanel');
        bottomContainer.onShouldTogglePanel(listener);
        trigger(bottomContainer.getTab('Project'), 'click');
        expect(listener).not.toHaveBeenCalled();
        trigger(bottomContainer.getTab('Project'), 'click');
        return expect(listener).toHaveBeenCalled();
      });
    });
    describe('::visibility', function() {
      return it('depends on displayLinterInfo', function() {
        atom.config.set('linter.displayLinterInfo', true);
        bottomContainer.visibility = true;
        expect(bottomContainer.visibility).toBe(true);
        atom.config.set('linter.displayLinterInfo', false);
        expect(bottomContainer.visibility).toBe(false);
        bottomContainer.visibility = true;
        expect(bottomContainer.visibility).toBe(false);
        atom.config.set('linter.displayLinterInfo', true);
        bottomContainer.visibility = true;
        expect(bottomContainer.visibility).toBe(true);
        bottomContainer.visibility = false;
        return expect(bottomContainer.visibility).toBe(false);
      });
    });
    return describe('.status::visibility', function() {
      return it('depends on displayLinterStatus', function() {
        atom.config.set('linter.displayLinterStatus', true);
        expect(bottomContainer.status.visibility).toBe(true);
        atom.config.set('linter.displayLinterStatus', false);
        expect(bottomContainer.status.visibility).toBe(false);
        atom.config.set('linter.displayLinterStatus', true);
        return expect(bottomContainer.status.visibility).toBe(true);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYWxlbnovLmF0b20vcGFja2FnZXMvbGludGVyL3NwZWMvdWkvYm90dG9tLWNvbnRhaW5lci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLFFBQUEseUNBQUE7QUFBQSxJQUFBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLCtCQUFSLENBQWxCLENBQUE7QUFBQSxJQUNBLGVBQUEsR0FBa0IsSUFEbEIsQ0FBQTtBQUFBLElBR0MsVUFBVyxPQUFBLENBQVEsV0FBUixFQUFYLE9BSEQsQ0FBQTtBQUFBLElBS0EsVUFBQSxDQUFXLFNBQUEsR0FBQTthQUNULGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFFBQTlCLENBQXVDLENBQUMsSUFBeEMsQ0FBNkMsU0FBQSxHQUFBOztZQUMzQyxlQUFlLENBQUUsT0FBakIsQ0FBQTtXQUFBO2lCQUNBLGVBQUEsR0FBa0IsZUFBZSxDQUFDLE1BQWhCLENBQXVCLE1BQXZCLEVBRnlCO1FBQUEsQ0FBN0MsRUFEYztNQUFBLENBQWhCLEVBRFM7SUFBQSxDQUFYLENBTEEsQ0FBQTtBQUFBLElBV0EsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQSxHQUFBO2FBQ25CLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBLEdBQUE7QUFDakMsUUFBQSxNQUFBLENBQU8sZUFBZSxDQUFDLE1BQWhCLENBQXVCLE1BQXZCLENBQUEsWUFBMEMsV0FBakQsQ0FBNkQsQ0FBQyxJQUE5RCxDQUFtRSxJQUFuRSxDQUFBLENBQUE7QUFBQSxRQUNBLE1BQUEsQ0FBTyxlQUFlLENBQUMsTUFBaEIsQ0FBdUIsTUFBdkIsQ0FBQSxZQUEwQyxXQUFqRCxDQUE2RCxDQUFDLElBQTlE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

//# sourceURL=/home/alenz/.atom/packages/linter/spec/ui/bottom-container-spec.coffee
