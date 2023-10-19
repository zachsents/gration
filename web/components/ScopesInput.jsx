import { ActionIcon, Group, Select, Stack, Text } from "@mantine/core"
import { useState } from "react"
import { TbX } from "react-icons/tb"


export default function ScopesInput({ value, onChange, ...props }) {

    const [searchValue, setSearchValue] = useState("")

    const addScope = scope => {
        onChange([...new Set([...value, scope])])
        setSearchValue("")
    }
    const removeScope = scope => onChange(value?.filter(s => s !== scope) || [])

    return (<>
        <Select
            data={props.data || []}
            limit={10}
            placeholder="Search scopes"
            searchable searchValue={searchValue} onSearchChange={setSearchValue}
            creatable
            onCreate={addScope}
            getCreateLabel={query => `Add scope "${query}"`}
            onChange={addScope}
            value={null}
            {...props}
        />
        <Stack className="gap-0 mt-2">
            {value?.map(scope =>
                <Group spacing="xs" key={scope}>
                    <ActionIcon onClick={() => removeScope(scope)}>
                        <TbX className="text-sm" />
                    </ActionIcon>
                    <Text className="text-sm">{scope}</Text>
                </Group>
            )}
        </Stack>
    </>)
}
