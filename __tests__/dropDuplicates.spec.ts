import { Observable } from 'rxjs/Rx';
import { dropDuplicates } from '../dropDuplicates';

describe('dropDuplicates', () => {
  it('drops duplicates', done => {
    const chunks$ = Observable.from([
      [{ id: 1 }, { id: 2 }],
      [{ id: 2 }, { id: 3 }],
    ]);

    chunks$
      .let(dropDuplicates)
      .toArray()
      .do(rows => {
        expect(rows).toHaveLength(2);
        const [row1, row2] = rows;
        expect(row1).toHaveLength(2);
        expect(row2).toHaveLength(1);
        const { id } = row2[0];
        expect(id).toBe(3);
      })
      .subscribe(undefined, done, done);
  });
});
