import FileNode from "./classes/file-node.class.js"
import FolderNode from "./classes/folder-node.class.js"

function handleAddCommand(currentFolder, type, name) {
  if (!type || !name) {
    console.log("Usage: add <type> <name>")
    return
  }

  if (type === "file") {
    currentFolder.add(new FileNode(name))
  } else if (type === "folder") {
    currentFolder.add(new FolderNode(name))
  } else {
    console.log("Invalid type. Use 'file' or 'folder'.")
  }
}

function handleRemoveCommand(currentFolder, name) {
  if (!name) {
    console.log("Usage: remove <name or path>")
    return
  }

  const listNames = name.split(/[\\/]/)
  let folder = currentFolder
  try {
    // Traverse the folder tree
    for (let i = 0; i < listNames.length - 1; i++) {
      folder = folder.retrieve(listNames[i])
    }

    folder.remove(listNames[listNames.length - 1])
    console.log(`Removed: ${name} successfully.`)
  } catch (error) {
    console.log(error.message)
  }
}

function handleRetrieveCommand(currentFolder, name) {
  if (!name) {
    console.log("Usage: retrieve <name or path>")
    return
  }

  const listNames = name.split(/[\\/]/)
  let folder = currentFolder

  try {
    // Traverse the folder tree
    for (let i = 0; i < listNames.length; i++) {
      folder = folder.retrieve(listNames[i])
    }

    console.log(`Retrieved: ${folder.name}`)
  } catch (error) {
    console.log(error.message)
  }
}

function handleSearchCommand(rootFolder, type, name) {
  if (!type || !name) {
    console.log("Usage: search <type> <name>")
    return
  }

  // Validate the type argument
  if (["all", "file", "folder"].indexOf(type) === -1) {
    console.log("Invalid type. Use 'all', 'file', or 'folder'.")
    return
  }

  // Search for the entity by name
  const result = rootFolder.search(name, type, "")
  if (result.length > 0) {
    console.log("Found:")
    result.forEach((path) => console.log(` - ${path}`))
  } else {
    console.log(`Entity with name '${name}' not found.`)
  }
}

function handleCdCommand(rl, currentFolder, name, currentPath, historyDir) {
  if (!name) {
    console.log("Usage: cd <name or path>")
    return {
      newFolder: currentFolder,
      newPath: currentPath,
      newHistoryDir: [...historyDir],
    }
  }

  const listNames = name.split(/[\\/]/)
  let folder = currentFolder
  let pathStr = currentPath
  let history = []

  try {
    // Traverse the folder tree
    for (const folderName of listNames) {
      folder = folder.retrieve(folderName)
      if (!(folder instanceof FolderNode)) {
        throw new Error(`${folderName} is not a folder.`)
      }
      history.push(folder)
      pathStr += `\\${folder.name}`
    }

    rl.setPrompt(`FolderTree: ${pathStr}> `) // Update the CLI prompt
    return {
      newFolder: folder,
      newPath: pathStr,
      newHistoryDir: [...historyDir, ...history],
    }
  } catch (error) {
    console.log(error.message)
    return {
      newFolder: currentFolder,
      newPath: currentPath,
      newHistoryDir: [...historyDir],
    }
  }
}

function handleBackCommand(rl, currentFolder, levels, pathStr, historyDir) {
  let numLevels = parseInt(levels, 10)
  if (isNaN(numLevels) || numLevels < 1) {
    numLevels = 1
  }

  // Only back to the root folder ["root"] ==> historyDir.length - 1
  if (numLevels > historyDir.length - 1) {
    console.log("Cannot go back that many levels.")
    return {
      newFolder: currentFolder,
      newPath: pathStr,
      newHistoryDir: historyDir,
    }
  }

  // Helper function to delete levels from the path string
  function deleteLevelsFromPath(pathStr, levels) {
    const pathComponents = pathStr.split("\\")
    if (levels >= pathComponents.length) {
      return "" // Return an empty string if levels to delete are more than or equal to the path components
    }
    const newPathComponents = pathComponents.slice(0, -levels)
    return newPathComponents.join("\\")
  }

  const newFolder = historyDir[historyDir.length - numLevels - 1]
  const newPathStr = deleteLevelsFromPath(pathStr, numLevels)

  rl.setPrompt(`FolderTree: ${newPathStr}> `) // Update the CLI prompt

  return {
    newFolder,
    newPath: newPathStr,
    newHistoryDir: historyDir.slice(0, -numLevels),
  }
}

function handleTestCommand(currentFolder) {
  console.log("Running test case...")

  currentFolder.add(new FolderNode("public"))
  currentFolder.add(new FolderNode("assets"))
  currentFolder.add(new FolderNode("src"))
  currentFolder.add(new FileNode("package.json"))
  currentFolder.add(new FileNode("README.md"))

  const srcFolder = currentFolder.retrieve("src")
  srcFolder.add(new FolderNode("controllers"))
  srcFolder.add(new FolderNode("models"))
  srcFolder.add(new FolderNode("services"))
  srcFolder.add(new FileNode("app.js"))
  srcFolder.add(new FileNode("server.js"))

  const controllersFolder = srcFolder.retrieve("controllers")
  controllersFolder.add(new FileNode("user.controller.js"))
  controllersFolder.add(new FileNode("product.controller.js"))

  const modelsFolder = srcFolder.retrieve("models")
  modelsFolder.add(new FileNode("user.model.js"))
  modelsFolder.add(new FileNode("product.model.js"))

  const servicesFolder = srcFolder.retrieve("services")
  servicesFolder.add(new FileNode("user.service.js"))
  servicesFolder.add(new FileNode("product.service.js"))

  console.log("Test case completed.")
}

export {
  handleAddCommand,
  handleRemoveCommand,
  handleRetrieveCommand,
  handleSearchCommand,
  handleCdCommand,
  handleBackCommand,
  handleTestCommand,
}
