import readline from "readline"
import FolderNode from "./classes/folder-node.class.js"
import {
  handleAddCommand,
  handleBackCommand,
  handleCdCommand,
  handleRemoveCommand,
  handleRetrieveCommand,
  handleSearchCommand,
  handleTestCommand,
} from "./handler.js"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const ACTIONS = {
  ADD: "add",
  REMOVE: "remove",
  RETRIEVE: "retrieve",
  SEARCH: "search",
  CD: "cd",
  BACK: "back",
  DISPLAY: "display",
  TEST: "test",
  EXIT: "exit",
  HELP: "help",
}

const helpText = `Commands: 
    add <type> <name>           : add a file or folder (type: file, folder).
    remove <name or path>       : remove a file or folder.
    retrieve <name or path>     : retrieve a file or folder.
    search <type> <name>        : search for a file or folder (type: all, file, folder).
    cd <name or path>           : change directory to a folder.
    back <number>               : go back to the parent folder. 
    display <type (optional)>   : display the folder tree or a specific folder (type: -c).
    test                        : run the test suite.
    exit                        : exit the CLI.
    help                        : display help text.`

console.log("Welcome to the Folder Tree CLI!")
console.log(helpText)

const rootFolder = new FolderNode("root")
let currentFolder = rootFolder
let pathStr = "root"
let historyDir = [rootFolder]

function handleCommand(command) {
  const [action, typeOrName, name] = command.split(" ")

  try {
    switch (action) {
      case ACTIONS.ADD:
        handleAddCommand(currentFolder, typeOrName, name)
        break

      case ACTIONS.REMOVE:
        handleRemoveCommand(currentFolder, typeOrName)
        break

      case ACTIONS.RETRIEVE:
        handleRetrieveCommand(currentFolder, typeOrName)
        break

      case ACTIONS.SEARCH:
        handleSearchCommand(rootFolder, typeOrName, name)
        break

      case ACTIONS.CD:
        const cdCommand = handleCdCommand(
          rl,
          currentFolder,
          typeOrName,
          pathStr,
          historyDir
        )
        currentFolder = cdCommand.newFolder
        pathStr = cdCommand.newPath
        historyDir = cdCommand.newHistoryDir
        break

      case ACTIONS.BACK:
        const backCommand = handleBackCommand(
          rl,
          currentFolder,
          typeOrName,
          pathStr,
          historyDir
        )

        currentFolder = backCommand.newFolder
        pathStr = backCommand.newPath
        historyDir = backCommand.newHistoryDir
        break

      case ACTIONS.DISPLAY:
        if (typeOrName === "-c") {
          currentFolder.display(0)
        } else {
          rootFolder.display()
        }
        break

      case ACTIONS.TEST:
        handleTestCommand(currentFolder)
        break

      case ACTIONS.EXIT:
        console.log("Exiting the CLI. Goodbye!")
        rl.close()
        return

      case ACTIONS.HELP:
        console.log(helpText)
        break

      default:
        console.log("Invalid command.")
    }
  } catch (error) {
    console.error(error.message)
  }

  rl.prompt()
}

rl.setPrompt(`FolderTree: ${pathStr}>`)
rl.prompt()
rl.on("line", handleCommand)
