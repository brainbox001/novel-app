import MinBinaryHeap from "../taskQueue";
let heap = new MinBinaryHeap();

describe('priority queue', () => {
    it('queue task by prority', async () => {
      heap.insert({id:2})
      heap.insert({id:2})
      heap.insert({id:1})
      expect(heap.tasks[0].id).toEqual(1)
    });
})