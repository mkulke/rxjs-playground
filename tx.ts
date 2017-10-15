import { Observable } from 'rxjs/Rx';
import { partial } from 'ramda';
import { Chunk } from './chunk';

interface Query {
  queryString: string;
  params: any[];
}

type RxOk = Observable<true>

interface Client {
  startTx: () => RxOk,
  endTx: () => RxOk,
  abortTx: () => RxOk,
  insert: (q: Query) => RxOk,
}

function _ok(): RxOk {
  return Observable.of<true>(true);
}

function _connect(): Observable<Client> {
  const client: Client = {
    startTx() {
      return _ok()
        .do(() => console.log('start tx'));
    },
    endTx() {
      return _ok()
        .do(() => console.log('end tx'));
    },
    abortTx() {
      return _ok()
        .do(() => console.log('abort tx'));
    },
    insert(query) {
      const { queryString, params } = query;
      return _ok()
        .do(() => console.log(`${queryString} ${params.join(',')}`));
    },
  };

  return Observable.of(client)
    .do(() => console.log('connect'));
}

function _buildQuery(chunk: Chunk): Query {
  const ids = chunk.map(obj => obj.id);

  if (ids.length > 2) {
    throw new Error('fail!');
  }

  return {
    queryString: 'insert',
    params: ids,
  };
}

function _buildQueries(chunks$: Observable<Chunk>): Observable<Query> {
  return chunks$
    .filter(chunks => chunks.length > 0)
    .map(_buildQuery);
}

function _insert(client: Client, query: Query): RxOk {
  return client.insert(query);
}

function _performTx(queries$: Observable<Query>, client: Client): RxOk {
  const startTx$ = client.startTx();
  const endTx$ = client.endTx();
  const abortTx$ = client.abortTx();
  const insert = partial(_insert, [client]);
  const inserts$ = queries$.mergeMap(insert);

  return Observable.concat(
    startTx$,
    inserts$,
    endTx$,
  ).catch(error => {
    return Observable.concat(
      abortTx$,
      Observable.throw(error),
    );
  });
}

function update(chunks$: Observable<Chunk>) {
  const queries$ = _buildQueries(chunks$);
  const performTx = partial(_performTx, [queries$]);

  return _connect()
    .mergeMap(performTx);
}

export {
  _buildQueries,
  _performTx,
  update,
}
