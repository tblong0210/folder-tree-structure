import BaseEntity from "./base-entity.class.js"

class FileNode extends BaseEntity {
  constructor(name) {
    super(name)
    this.content = "Empty content"
  }

  add() {
    throw new Error("Cannot add to a file.")
  }

  remove() {
    throw new Error("Cannot remove from a file.")
  }

  retrieve() {
    throw new Error("Cannot retrieve from a file.")
  }

  search(entityName, typeFile, currentPath) {
    return this.name.includes(entityName) &&
      (typeFile === "file" || typeFile === "all")
      ? [`${currentPath}/${this.name}`]
      : []
  }
}

export default FileNode
