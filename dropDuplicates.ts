import { Observable } from 'rxjs/Rx';
import { Chunk } from './chunk';

interface Acc {
  chunk: Chunk;
  ids: number[];
}

function dropDuplicates(chunks$: Observable<Chunk>): Observable<Chunk> {
  const seed: Acc = {
    ids: [],
    chunk: [],
  };

  return chunks$
    .scan((acc, chunk) => {
      const filteredChunk = chunk.filter(obj => {
        return acc.ids.indexOf(obj.id) === -1;
      });
      const ids = filteredChunk.map(obj => obj.id);

      return {
        chunk: filteredChunk,
        ids: [...acc.ids, ...ids],
      };
    }, seed)
    .map(acc => acc.chunk);
}

export {
  dropDuplicates,
}
