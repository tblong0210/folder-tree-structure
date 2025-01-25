class BaseEntity {
  constructor(name) {
    this.name = name
    this.createdAt = new Date()
  }

  add(entity) {
    throw new Error("Method 'add' is not implemented.")
  }

  remove(entityName) {
    throw new Error("Method 'remove' is not implemented.")
  }

  retrieve(entityName) {
    throw new Error("Method 'retrieve' is not implemented.")
  }

  search(entityName, typeFile, currentPath) {
    throw new Error("Method 'search' is not implemented.")
  }

  display(indent = 0) {
    console.log(`|${" ".repeat(indent)}|--${this.name}`)
  }
}

export default BaseEntity
