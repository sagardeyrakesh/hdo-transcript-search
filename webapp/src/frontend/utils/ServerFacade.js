import Promise from 'bluebird';
import reqwest from 'reqwest';

export default class ServerFacade {
    summary(queries, interval) {
        return Promise.map(queries, q => {
            return reqwest(this._summaryPathFor(q, interval)).then((r) => {
                return {query: q, result: r};
            });
        });
    }

    hits(queries, start = 0, size = 5) {
        return Promise.map(queries, function(query) {
            var path = `/api/search/hits?query=${query}&sort=time.desc&size=${size}`;

            if (start) {
                path += `&start=${start}`;
            }

            return reqwest(path);
        });
    }

    speechContext(transcriptId, start, end) {
        var path = `/api/context/${transcriptId}/${start}/${end}`;
        return reqwest(path);
    }

    _summaryPathFor(query, interval) {
        return `/api/search/summary?interval=${interval}&query=${query}`;
    }
}
