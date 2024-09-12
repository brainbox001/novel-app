
interface Task {
    id:number, 
    taskName : string, 
    options : any, 
    callback:(result: any) => void
}
export default class MaxBinaryHeap {
    tasks : any[]
    constructor() {
        this.tasks = []
    }
    parentIndex(index:number) {
        if (index === 0) return 0;
        return Math.floor((index - 1) / 2)
    }
    parentValue(index:number) {
        return this.tasks[this.parentIndex(index)].id;
    }
    childIndexLeft(index:number) {
        let final = 2 * index + 1;
        if (final >= this.tasks.length) return index
        return final;
    }
    childIndexRight(index:number) {
        let final = 2 * index + 2;
        if (final >= this.tasks.length) return index
        return final;
    }
    childValueLeft(index:number) {
        return this.tasks[this.childIndexLeft(index)].id;
    }
    childValueRigth(index:number) {
        return this.tasks[this.childIndexRight(index)].id;
    }
    insert(task:any) {
        this.tasks.push(task)
        let currentIndex = this.tasks.length - 1;
        while (this.parentValue(currentIndex) > this.tasks[currentIndex].id) {
            [this.tasks[currentIndex], this.tasks[this.parentIndex(currentIndex)]] = [this.tasks[this.parentIndex(currentIndex)], this.tasks[currentIndex]]
            currentIndex = this.parentIndex(currentIndex);
        }
    }
    remove() {
        let currentIndex = 0;
        // swap with the last
        [this.tasks[currentIndex], this.tasks[this.tasks.length - 1]] = [this.tasks[this.tasks.length - 1], this.tasks[currentIndex]];
        let newTask:{} = this.tasks.pop();
        while (this.tasks.length > 0 && (this.tasks[currentIndex].id > this.childValueLeft(currentIndex) || this.tasks[currentIndex].id > this.childValueRigth(currentIndex))) {
            if (this.childValueLeft(currentIndex) < this.childValueRigth(currentIndex)) {
                //swap with left
                [this.tasks[currentIndex], this.tasks[this.childIndexLeft(currentIndex)]] = [this.tasks[this.childIndexLeft(currentIndex)], this.tasks[currentIndex]];
                currentIndex = this.childIndexLeft(currentIndex);
            } else {
                // swap with right guy
                [this.tasks[currentIndex], this.tasks[this.childIndexRight(currentIndex)]] = [this.tasks[this.childIndexRight(currentIndex)], this.tasks[currentIndex]];
                currentIndex = this.childIndexRight(currentIndex);
            }
        }
        return newTask
    }
}