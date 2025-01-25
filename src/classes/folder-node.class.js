import BaseEntity from "./base-entity.class.js"

class FolderNode extends BaseEntity {
  constructor(name) {
    super(name)
    this.children = new Map() // Use a Map to store child entities
  }

  add(entity) {
    if (this.children.has(entity.name)) {
      throw new Error(
        `Entity with name '${entity.name}' already exists in folder '${this.name}'.`
      )
    }
    this.children.set(entity.name, entity)
  }

  remove(entityName) {
    if (!this.children.has(entityName)) {
      throw new Error(
        `Entity with name '${entityName}' does not exist in folder '${this.name}'.`
      )
    }
    this.children.delete(entityName)
  }

  retrieve(entityName) {
    if (!this.children.has(entityName)) {
      throw new Error(
        `Entity with name '${entityName}' does not exist in folder '${this.name}'.`
      )
    }
    return this.children.get(entityName)
  }

  search(entityName, typeFile = "all", currentPath = "") {
    let results = []
    const fullPath = `${currentPath}/${this.name}`

    if (
      this.name.includes(entityName) &&
      (typeFile === "folder" || typeFile === "all")
    ) {
      results.push(fullPath)
    }

    for (const entity of this.children.values()) {
      results = results.concat(entity.search(entityName, typeFile, fullPath))
    }

    return results
  }

  display(indent = 0) {
    super.display(indent)

    for (const entity of this.children.values()) {
      entity.display(indent + 2)
    }
  }
}

export default FolderNode
