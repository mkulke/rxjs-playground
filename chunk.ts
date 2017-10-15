import { Observable } from 'rxjs/Rx';

interface Obj {
  id: number;
}

export type Chunk = Obj[]

const chunks$: Observable<Chunk> = Observable.from([
  [{ id: 1 }, { id: 2}],
  [{ id: 3 }, { id: 2}],
  [{ id: 1 }],
  [{ id: 5 }, { id: 7}, { id: 4 }],
]);

export {
  chunks$
}
