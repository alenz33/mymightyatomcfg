"use babel";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = {
  config: {
    execPath: {
      title: "GCC Executable Path",
      description: "Note for Windows/Mac OSX users: please ensure that GCC is in your ```$PATH``` otherwise the linter might not work. If your path contains spaces, it needs to be enclosed in double quotes.",
      type: "string",
      "default": "/usr/bin/g++"
    },
    gccIncludePaths: {
      title: "GCC Include Paths",
      description: "Enter your include paths as a comma-separated list. Paths starting with ```.``` or ```..``` are expanded relative to the project root/file path. If any of your paths contain spaces, they need to be enclosed in double quotes.",
      type: "string",
      "default": " "
    },
    gccSuppressWarnings: {
      title: "Suppress GCC Warnings",
      type: "boolean",
      "default": false
    },
    gccDefaultCFlags: {
      title: "C Flags",
      type: "string",
      "default": "-c -Wall"
    },
    gccDefaultCppFlags: {
      title: "C++ Flags",
      type: "string",
      "default": "-c -Wall -std=c++11"
    },
    gccErrorLimit: {
      title: "GCC Error Limit",
      type: "integer",
      "default": 0
    }
  },

  activate: function activate() {
    if (!atom.packages.getLoadedPackages("linter")) {
      atom.notifications.addError("Linter package not found.", {
        detail: "Please install the `linter` package in your Settings view."
      });
    }
    require("atom-package-deps").install("linter-gcc");
  },

  provideLinter: function provideLinter() {
    var helpers = require("atom-linter");
    var regex = "(?<file>.+):(?<line>\\d+):(?<col>\\d+):\\s*\\w*\\s*(?<type>(error|warning|note)):\\s*(?<message>.*)";

    // Read configuration data from JSON file .gcc-config.json
    // in project root
    return {
      name: "GCC",
      grammarScopes: ["source.c", "source.cpp"],
      scope: "file",
      lintOnFly: false,
      lint: function lint(activeEditor) {
        config = require("./config");
        var path = require('path');
        settings = config.settings();
        var file = activeEditor.getPath();
        var cwd = atom.project.getPaths()[0];
        if (!cwd) {
          editor = atom.workspace.getActivePaneItem();
          if (editor) {
            temp_file = editor.buffer.file;
            if (temp_file) {
              cwd = temp_file.getParent().getPath();
            }
          }
        }
        command = settings.execPath;

        // Expand path if necessary
        if (command.substring(0, 1) == ".") {
          command = path.join(cwd, command);
        }

        // Cross-platform $PATH expansion
        command = require("shelljs").which(command);
        if (!command) {
          atom.notifications.addError("linter-gcc: Executable not found", {
            detail: "\"" + settings.execPath + "\" not found"
          });
          console.log("linter-gcc: \"" + settings.execPath + "\" not found");
          return;
        }

        args = [];
        var flags = "";
        grammar_name = activeEditor.getGrammar().name;
        if (grammar_name === "C++") {
          flags = settings.gccDefaultCppFlags;
        } else if (grammar_name === "C") {
          flags = settings.gccDefaultCFlags;
        }

        var tempargs = flags.split(" ");
        tempargs.forEach(function (entry) {
          entry = entry.trim();
          if (entry.length > 0) {
            args.push(entry);
          }
        });

        args.push("-fmax-errors=" + settings.gccErrorLimit);
        if (settings.gccSuppressWarnings) {
          args.push("-w");
        }

        var s = settings.gccIncludePaths;
        s = s.trim();
        if (s.length != 0) {
          tempargs = s.split(",");
          tempargs.forEach(function (entry) {
            entry = entry.trim();
            if (entry.length != 0) {
              if (entry.substring(0, 1) == ".") {
                entry = path.join(cwd, entry);
              }
              item = "-I" + entry;
              args.push(item);
            }
          });
        }

        args.push(file);

        full_command = "linter-gcc: " + command;
        args.forEach(function (entry) {
          full_command = full_command + " " + entry;
        });

        console.log(full_command);

        return helpers.exec(command, args, { stream: "stderr" }).then(function (output) {
          messages = helpers.parse(output, regex);
          var searchString = "error";
          var error_pos = output.indexOf(searchString);
          if (messages.length == 0) {
            if (error_pos != -1) {
              messages.push({
                type: "error",
                text: output.substring(error_pos, output.length - 1)
              });
            }
          }
          return messages;
        });
      }
    };
  }
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FsZW56Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci1nY2MvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7OztxQkFFRztBQUNiLFFBQU0sRUFBRTtBQUNOLFlBQVEsRUFBRTtBQUNSLFdBQUssRUFBRSxxQkFBcUI7QUFDNUIsaUJBQVcsRUFBRSw0TEFBNEw7QUFDek0sVUFBSSxFQUFFLFFBQVE7QUFDZCxpQkFBUyxjQUFjO0tBQ3hCO0FBQ0QsbUJBQWUsRUFBRTtBQUNmLFdBQUssRUFBRSxtQkFBbUI7QUFDMUIsaUJBQVcsRUFBRSxrT0FBa087QUFDL08sVUFBSSxFQUFFLFFBQVE7QUFDZCxpQkFBUyxHQUFHO0tBQ2I7QUFDRCx1QkFBbUIsRUFBRTtBQUNuQixXQUFLLEVBQUUsdUJBQXVCO0FBQzlCLFVBQUksRUFBRSxTQUFTO0FBQ2YsaUJBQVMsS0FBSztLQUNmO0FBQ0Qsb0JBQWdCLEVBQUU7QUFDaEIsV0FBSyxFQUFFLFNBQVM7QUFDaEIsVUFBSSxFQUFFLFFBQVE7QUFDZCxpQkFBUyxVQUFVO0tBQ3BCO0FBQ0Qsc0JBQWtCLEVBQUU7QUFDbEIsV0FBSyxFQUFFLFdBQVc7QUFDbEIsVUFBSSxFQUFFLFFBQVE7QUFDZCxpQkFBUyxxQkFBcUI7S0FDL0I7QUFDRCxpQkFBYSxFQUFFO0FBQ2IsV0FBSyxFQUFFLGlCQUFpQjtBQUN4QixVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLENBQUM7S0FDWDtHQUNGOztBQUVELFVBQVEsRUFBRSxvQkFBTTtBQUNkLFFBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQzdDLFVBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUN6QiwyQkFBMkIsRUFDM0I7QUFDRSxjQUFNLEVBQUUsNERBQTREO09BQ3JFLENBQ0YsQ0FBQztLQUNIO0FBQ0QsV0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0dBQ3BEOztBQUVELGVBQWEsRUFBRSx5QkFBTTtBQUNuQixRQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDdkMsUUFBTSxLQUFLLEdBQUcscUdBQXFHLENBQUM7Ozs7QUFJcEgsV0FBTztBQUNMLFVBQUksRUFBRSxLQUFLO0FBQ1gsbUJBQWEsRUFBRSxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUM7QUFDekMsV0FBSyxFQUFFLE1BQU07QUFDYixlQUFTLEVBQUUsS0FBSztBQUNoQixVQUFJLEVBQUUsY0FBQyxZQUFZLEVBQUs7QUFDdEIsY0FBTSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM3QixZQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0IsZ0JBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDN0IsWUFBSSxJQUFJLEdBQUcsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2xDLFlBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDcEMsWUFBSSxDQUFDLEdBQUcsRUFBRTtBQUNOLGdCQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0FBQzVDLGNBQUksTUFBTSxFQUFFO0FBQ1IscUJBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztBQUMvQixnQkFBSSxTQUFTLEVBQUU7QUFDWCxpQkFBRyxHQUFHLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUN6QztXQUNKO1NBQ0o7QUFDRCxlQUFPLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQzs7O0FBRzVCLFlBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxFQUFFO0FBQy9CLGlCQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDckM7OztBQUdELGVBQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzVDLFlBQUksQ0FBQyxPQUFPLEVBQUU7QUFDVixjQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FDekIsa0NBQWtDLEVBQ2xDO0FBQ0Usa0JBQU0sRUFBRSxJQUFJLEdBQUcsUUFBUSxDQUFDLFFBQVEsR0FBRyxjQUFjO1dBQ2xELENBQ0YsQ0FBQztBQUNGLGlCQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxRQUFRLEdBQUcsY0FBYyxDQUFDLENBQUM7QUFDbkUsaUJBQU87U0FDVjs7QUFFRCxZQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ1YsWUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2Ysb0JBQVksR0FBRyxZQUFZLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDO0FBQzlDLFlBQUcsWUFBWSxLQUFLLEtBQUssRUFBRTtBQUN6QixlQUFLLEdBQUcsUUFBUSxDQUFDLGtCQUFrQixDQUFDO1NBQ3JDLE1BQU0sSUFBRyxZQUFZLEtBQUssR0FBRyxFQUFFO0FBQzlCLGVBQUssR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUM7U0FDbkM7O0FBRUQsWUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoQyxnQkFBUSxDQUFDLE9BQU8sQ0FBRSxVQUFTLEtBQUssRUFBRTtBQUM5QixlQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3JCLGNBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUM7QUFDakIsZ0JBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7V0FDcEI7U0FDSixDQUFDLENBQUM7O0FBRUgsWUFBSSxDQUFDLElBQUksbUJBQWlCLFFBQVEsQ0FBQyxhQUFhLENBQUcsQ0FBQztBQUNwRCxZQUFHLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtBQUMvQixjQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2pCOztBQUVELFlBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUM7QUFDakMsU0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNiLFlBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSyxDQUFDLEVBQUU7QUFDaEIsa0JBQVEsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLGtCQUFRLENBQUMsT0FBTyxDQUFDLFVBQVMsS0FBSyxFQUFFO0FBQzdCLGlCQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3JCLGdCQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO0FBQ25CLGtCQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsRUFBRTtBQUM3QixxQkFBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO2VBQ2pDO0FBQ0Qsa0JBQUksR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO0FBQ3BCLGtCQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ25CO1dBQ0osQ0FBQyxDQUFDO1NBQ047O0FBRUQsWUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFaEIsb0JBQVksR0FBRyxjQUFjLEdBQUcsT0FBTyxDQUFDO0FBQ3hDLFlBQUksQ0FBQyxPQUFPLENBQUMsVUFBUyxLQUFLLEVBQUM7QUFDeEIsc0JBQVksR0FBRyxZQUFZLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQztTQUM3QyxDQUFDLENBQUM7O0FBRUgsZUFBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQzs7QUFFMUIsZUFBTyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBQyxNQUFNLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNLEVBQ2hFO0FBQ0ksa0JBQVEsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN4QyxjQUFJLFlBQVksR0FBRyxPQUFPLENBQUM7QUFDM0IsY0FBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUM3QyxjQUFJLFFBQVEsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO0FBQ3RCLGdCQUFJLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRTtBQUNqQixzQkFBUSxDQUFDLElBQUksQ0FBQztBQUNWLG9CQUFJLEVBQUUsT0FBTztBQUNiLG9CQUFJLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7ZUFDdkQsQ0FBQyxDQUFDO2FBQ047V0FDSjtBQUNELGlCQUFPLFFBQVEsQ0FBQztTQUNuQixDQUNGLENBQUM7T0FDSDtLQUNGLENBQUM7R0FDSDtDQUNGIiwiZmlsZSI6Ii9ob21lL2FsZW56Ly5hdG9tL3BhY2thZ2VzL2xpbnRlci1nY2MvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbmZpZzoge1xuICAgIGV4ZWNQYXRoOiB7XG4gICAgICB0aXRsZTogXCJHQ0MgRXhlY3V0YWJsZSBQYXRoXCIsXG4gICAgICBkZXNjcmlwdGlvbjogXCJOb3RlIGZvciBXaW5kb3dzL01hYyBPU1ggdXNlcnM6IHBsZWFzZSBlbnN1cmUgdGhhdCBHQ0MgaXMgaW4geW91ciBgYGAkUEFUSGBgYCBvdGhlcndpc2UgdGhlIGxpbnRlciBtaWdodCBub3Qgd29yay4gSWYgeW91ciBwYXRoIGNvbnRhaW5zIHNwYWNlcywgaXQgbmVlZHMgdG8gYmUgZW5jbG9zZWQgaW4gZG91YmxlIHF1b3Rlcy5cIixcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBkZWZhdWx0OiBcIi91c3IvYmluL2crK1wiXG4gICAgfSxcbiAgICBnY2NJbmNsdWRlUGF0aHM6IHtcbiAgICAgIHRpdGxlOiBcIkdDQyBJbmNsdWRlIFBhdGhzXCIsXG4gICAgICBkZXNjcmlwdGlvbjogXCJFbnRlciB5b3VyIGluY2x1ZGUgcGF0aHMgYXMgYSBjb21tYS1zZXBhcmF0ZWQgbGlzdC4gUGF0aHMgc3RhcnRpbmcgd2l0aCBgYGAuYGBgIG9yIGBgYC4uYGBgIGFyZSBleHBhbmRlZCByZWxhdGl2ZSB0byB0aGUgcHJvamVjdCByb290L2ZpbGUgcGF0aC4gSWYgYW55IG9mIHlvdXIgcGF0aHMgY29udGFpbiBzcGFjZXMsIHRoZXkgbmVlZCB0byBiZSBlbmNsb3NlZCBpbiBkb3VibGUgcXVvdGVzLlwiLFxuICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgIGRlZmF1bHQ6IFwiIFwiXG4gICAgfSxcbiAgICBnY2NTdXBwcmVzc1dhcm5pbmdzOiB7XG4gICAgICB0aXRsZTogXCJTdXBwcmVzcyBHQ0MgV2FybmluZ3NcIixcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICAgIGdjY0RlZmF1bHRDRmxhZ3M6IHtcbiAgICAgIHRpdGxlOiBcIkMgRmxhZ3NcIixcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBkZWZhdWx0OiBcIi1jIC1XYWxsXCJcbiAgICB9LFxuICAgIGdjY0RlZmF1bHRDcHBGbGFnczoge1xuICAgICAgdGl0bGU6IFwiQysrIEZsYWdzXCIsXG4gICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgZGVmYXVsdDogXCItYyAtV2FsbCAtc3RkPWMrKzExXCJcbiAgICB9LFxuICAgIGdjY0Vycm9yTGltaXQ6IHtcbiAgICAgIHRpdGxlOiBcIkdDQyBFcnJvciBMaW1pdFwiLFxuICAgICAgdHlwZTogXCJpbnRlZ2VyXCIsXG4gICAgICBkZWZhdWx0OiAwXG4gICAgfVxuICB9LFxuXG4gIGFjdGl2YXRlOiAoKSA9PiB7XG4gICAgaWYoIWF0b20ucGFja2FnZXMuZ2V0TG9hZGVkUGFja2FnZXMoXCJsaW50ZXJcIikpIHtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcbiAgICAgICAgXCJMaW50ZXIgcGFja2FnZSBub3QgZm91bmQuXCIsXG4gICAgICAgIHtcbiAgICAgICAgICBkZXRhaWw6IFwiUGxlYXNlIGluc3RhbGwgdGhlIGBsaW50ZXJgIHBhY2thZ2UgaW4geW91ciBTZXR0aW5ncyB2aWV3LlwiXG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuICAgIHJlcXVpcmUoXCJhdG9tLXBhY2thZ2UtZGVwc1wiKS5pbnN0YWxsKFwibGludGVyLWdjY1wiKTtcbiAgfSxcblxuICBwcm92aWRlTGludGVyOiAoKSA9PiB7XG4gICAgY29uc3QgaGVscGVycyA9IHJlcXVpcmUoXCJhdG9tLWxpbnRlclwiKTtcbiAgICBjb25zdCByZWdleCA9IFwiKD88ZmlsZT4uKyk6KD88bGluZT5cXFxcZCspOig/PGNvbD5cXFxcZCspOlxcXFxzKlxcXFx3KlxcXFxzKig/PHR5cGU+KGVycm9yfHdhcm5pbmd8bm90ZSkpOlxcXFxzKig/PG1lc3NhZ2U+LiopXCI7XG5cbiAgICAvLyBSZWFkIGNvbmZpZ3VyYXRpb24gZGF0YSBmcm9tIEpTT04gZmlsZSAuZ2NjLWNvbmZpZy5qc29uXG4gICAgLy8gaW4gcHJvamVjdCByb290XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IFwiR0NDXCIsXG4gICAgICBncmFtbWFyU2NvcGVzOiBbXCJzb3VyY2UuY1wiLCBcInNvdXJjZS5jcHBcIl0sXG4gICAgICBzY29wZTogXCJmaWxlXCIsXG4gICAgICBsaW50T25GbHk6IGZhbHNlLFxuICAgICAgbGludDogKGFjdGl2ZUVkaXRvcikgPT4ge1xuICAgICAgICBjb25maWcgPSByZXF1aXJlKFwiLi9jb25maWdcIik7XG4gICAgICAgIHZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuICAgICAgICBzZXR0aW5ncyA9IGNvbmZpZy5zZXR0aW5ncygpO1xuICAgICAgICB2YXIgZmlsZSA9IGFjdGl2ZUVkaXRvci5nZXRQYXRoKCk7XG4gICAgICAgIHZhciBjd2QgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXVxuICAgICAgICBpZiAoIWN3ZCkge1xuICAgICAgICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKTtcbiAgICAgICAgICAgIGlmIChlZGl0b3IpIHtcbiAgICAgICAgICAgICAgICB0ZW1wX2ZpbGUgPSBlZGl0b3IuYnVmZmVyLmZpbGU7XG4gICAgICAgICAgICAgICAgaWYgKHRlbXBfZmlsZSkge1xuICAgICAgICAgICAgICAgICAgICBjd2QgPSB0ZW1wX2ZpbGUuZ2V0UGFyZW50KCkuZ2V0UGF0aCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb21tYW5kID0gc2V0dGluZ3MuZXhlY1BhdGg7XG5cbiAgICAgICAgLy8gRXhwYW5kIHBhdGggaWYgbmVjZXNzYXJ5XG4gICAgICAgIGlmIChjb21tYW5kLnN1YnN0cmluZygwLDEpID09IFwiLlwiKSB7XG4gICAgICAgICAgICBjb21tYW5kID0gcGF0aC5qb2luKGN3ZCwgY29tbWFuZCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDcm9zcy1wbGF0Zm9ybSAkUEFUSCBleHBhbnNpb25cbiAgICAgICAgY29tbWFuZCA9IHJlcXVpcmUoXCJzaGVsbGpzXCIpLndoaWNoKGNvbW1hbmQpO1xuICAgICAgICBpZiAoIWNvbW1hbmQpIHtcbiAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcbiAgICAgICAgICAgICAgXCJsaW50ZXItZ2NjOiBFeGVjdXRhYmxlIG5vdCBmb3VuZFwiLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZGV0YWlsOiBcIlxcXCJcIiArIHNldHRpbmdzLmV4ZWNQYXRoICsgXCJcXFwiIG5vdCBmb3VuZFwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImxpbnRlci1nY2M6IFxcXCJcIiArIHNldHRpbmdzLmV4ZWNQYXRoICsgXCJcXFwiIG5vdCBmb3VuZFwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGFyZ3MgPSBbXTtcbiAgICAgICAgdmFyIGZsYWdzID0gXCJcIjtcbiAgICAgICAgZ3JhbW1hcl9uYW1lID0gYWN0aXZlRWRpdG9yLmdldEdyYW1tYXIoKS5uYW1lO1xuICAgICAgICBpZihncmFtbWFyX25hbWUgPT09IFwiQysrXCIpIHtcbiAgICAgICAgICBmbGFncyA9IHNldHRpbmdzLmdjY0RlZmF1bHRDcHBGbGFncztcbiAgICAgICAgfSBlbHNlIGlmKGdyYW1tYXJfbmFtZSA9PT0gXCJDXCIpIHtcbiAgICAgICAgICBmbGFncyA9IHNldHRpbmdzLmdjY0RlZmF1bHRDRmxhZ3M7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdGVtcGFyZ3MgPSBmbGFncy5zcGxpdChcIiBcIik7XG4gICAgICAgIHRlbXBhcmdzLmZvckVhY2goIGZ1bmN0aW9uKGVudHJ5KSB7XG4gICAgICAgICAgICBlbnRyeSA9IGVudHJ5LnRyaW0oKTtcbiAgICAgICAgICAgIGlmIChlbnRyeS5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgICBhcmdzLnB1c2goZW50cnkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBhcmdzLnB1c2goYC1mbWF4LWVycm9ycz0ke3NldHRpbmdzLmdjY0Vycm9yTGltaXR9YCk7XG4gICAgICAgIGlmKHNldHRpbmdzLmdjY1N1cHByZXNzV2FybmluZ3MpIHtcbiAgICAgICAgICBhcmdzLnB1c2goXCItd1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzID0gc2V0dGluZ3MuZ2NjSW5jbHVkZVBhdGhzO1xuICAgICAgICBzID0gcy50cmltKCk7XG4gICAgICAgIGlmIChzLmxlbmd0aCAhPSAgMCkge1xuICAgICAgICAgICAgdGVtcGFyZ3MgPSBzLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgICAgIHRlbXBhcmdzLmZvckVhY2goZnVuY3Rpb24oZW50cnkpIHtcbiAgICAgICAgICAgICAgICBlbnRyeSA9IGVudHJ5LnRyaW0oKTtcbiAgICAgICAgICAgICAgICBpZiAoZW50cnkubGVuZ3RoICE9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVudHJ5LnN1YnN0cmluZygwLDEpID09IFwiLlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbnRyeSA9IHBhdGguam9pbihjd2QsIGVudHJ5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpdGVtID0gXCItSVwiICsgZW50cnk7XG4gICAgICAgICAgICAgICAgICAgIGFyZ3MucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFyZ3MucHVzaChmaWxlKTtcblxuICAgICAgICBmdWxsX2NvbW1hbmQgPSBcImxpbnRlci1nY2M6IFwiICsgY29tbWFuZDtcbiAgICAgICAgYXJncy5mb3JFYWNoKGZ1bmN0aW9uKGVudHJ5KXtcbiAgICAgICAgICAgIGZ1bGxfY29tbWFuZCA9IGZ1bGxfY29tbWFuZCArIFwiIFwiICsgZW50cnk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKGZ1bGxfY29tbWFuZCk7XG5cbiAgICAgICAgcmV0dXJuIGhlbHBlcnMuZXhlYyhjb21tYW5kLCBhcmdzLCB7c3RyZWFtOiBcInN0ZGVyclwifSkudGhlbihvdXRwdXQgPT5cbiAgICAgICAgICB7XG4gICAgICAgICAgICAgIG1lc3NhZ2VzID0gaGVscGVycy5wYXJzZShvdXRwdXQsIHJlZ2V4KTtcbiAgICAgICAgICAgICAgdmFyIHNlYXJjaFN0cmluZyA9IFwiZXJyb3JcIjtcbiAgICAgICAgICAgICAgdmFyIGVycm9yX3BvcyA9IG91dHB1dC5pbmRleE9mKHNlYXJjaFN0cmluZyk7XG4gICAgICAgICAgICAgIGlmIChtZXNzYWdlcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgaWYgKGVycm9yX3BvcyAhPSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImVycm9yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IG91dHB1dC5zdWJzdHJpbmcoZXJyb3JfcG9zLCBvdXRwdXQubGVuZ3RoIC0gMSlcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gbWVzc2FnZXM7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn07XG4iXX0=
//# sourceURL=/home/alenz/.atom/packages/linter-gcc/lib/main.js
