async function setupEmptyBuilding() {
  const building = {
    name: 'test-b1',
  }
  const { id: buildingId } = (await this.request.post('/buildings', building)).data

  const floor = {
    name: 'test-f1', label: 'l1', number: 1, buildingId,
  }
  const floorData = (await this.request.post('/floors', floor)).data
  const floorId = floorData.id
  this.floorIds = [floorId]

  this.markers = []
}

module.exports = setupEmptyBuilding
