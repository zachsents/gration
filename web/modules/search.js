import { useDebouncedValue } from "@mantine/hooks"
import fuzzy from "fuzzy"
import _ from "lodash"
import { useMemo, useState } from "react"


const HIGHLIGHT_DELIMITER = "***"

export function useSearch(list, {
    selector,
    debounce,
    highlight = false,
} = {}) {

    const [query, setQuery] = useState("")
    let queryToUse = query

    if (debounce != null) {
        const [debouncedQuery] = useDebouncedValue(query, debounce)
        queryToUse = debouncedQuery
    }

    const [filtered, strings] = useMemo(
        () => _.unzip(
            fuzzy.filter(queryToUse, list, {
                extract: selector,
                pre: HIGHLIGHT_DELIMITER,
                post: HIGHLIGHT_DELIMITER,
            })
                .map(result => [result.original, result.string.split(HIGHLIGHT_DELIMITER)])
        ),
        [list, queryToUse]
    )

    return [filtered ?? [], query, setQuery, highlight && (strings ?? [])]
}