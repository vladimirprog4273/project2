module.exports = (resource) => {
  switch (resource) {
    case 'staff':
      return 0

    case 'rooms':
      return 1

    case 'utilities':
      return 2

    default:
      return { inq: [3, 4] }
  }
}
