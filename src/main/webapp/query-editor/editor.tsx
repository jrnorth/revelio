import React, { useState } from 'react'

import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'

import loadable from 'react-loadable'
import Button from '@material-ui/core/Button'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import useAttributeDefinitions from '../react-hooks/use-attribute-definitions'

import QueryBuilder from '../query-builder/query-builder'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { AttributeDefinition, QueryType } from '../query-builder/types'
import IconButton from '@material-ui/core/IconButton'

const { useQueryExecutor, useApolloFallback } = require('../react-hooks')
const genResults = require('../gen-results').default

const Loading = () => {
  return (
    <Paper>
      <LinearProgress />
    </Paper>
  )
}
const Error = (props: any) => {
  return (
    <Paper>
      <Typography>
        {props.message ? props.message : 'Something went wrong'}
      </Typography>
    </Paper>
  )
}

let Visualizations: any = () => null

if (typeof window !== 'undefined') {
  Visualizations = loadable({
    loader: () =>
      import(//prettier-ignore
      // @ts-ignore
      /* webpackChunkName: "visualizations" */ '../workspaces/visualizations').then(
        module => module.default
      ),
    loading: Loading,
  })
}

type FooterProps = {
  onSearch: () => void
  onCancel: () => void
  onSave: () => void
}

const Footer = (props: FooterProps) => {
  return (
    <Box display="flex" justifyContent="flex-end" height="55px">
      <Box
        style={{
          margin: 'auto 5px',
          flexGrow: 1,
        }}
      >
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      </Box>

      <Box
        style={{
          margin: 'auto 5px',
        }}
      >
        <Button
          variant="outlined"
          color="secondary"
          endIcon={<PlayCircleFilledIcon />}
          onClick={props.onSearch}
        >
          Test Search
        </Button>
        <Box style={{ width: 10, display: 'inline-block' }} />

        <Button onClick={props.onCancel} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Box style={{ width: 10, display: 'inline-block' }} />
        <Button variant="contained" color="primary" onClick={props.onSave}>
          Save
        </Button>
      </Box>
    </Box>
  )
}

type EditorProps = {
  attributeDefinitions?: AttributeDefinition[]
  form?: QueryType
  onCancel: () => void
  onSave: (form: QueryType) => void
  onSearch: (query: any) => void
  queryBuilder: React.FunctionComponent
  results?: Array<any>
}

const searchFormToSearch = (form: QueryType) => {
  const { sources: srcs, sorts, detail_level, filterTree } = form
  return {
    filterTree,
    srcs: srcs || ['ddf.distribution'],
    sorts: (sorts || []).map(sort => {
      const splitIndex = sort.lastIndexOf(',')
      return {
        attribute: sort.substring(0, splitIndex),
        direction: sort.substring(splitIndex + 1, sort.length),
      }
    }),
    detail_level: detail_level === 'All Fields' ? undefined : detail_level,
  }
}

export const SearchFormEditor = (props: EditorProps) => {
  const form = props.form || {}

  const onSearch = () => {
    props.onSearch(searchFormToSearch(form))
  }

  return (
    <Box width="100%" display="flex" flexDirection="column" height="100%">
      <Typography
        variant="h4"
        component="h1"
        style={{ padding: 20 }}
        color="textPrimary"
      >
        Search Form Editor
      </Typography>
      <Divider />
      <Box width="100%" display="flex" flexDirection="row" height="100%">
        <Box style={{ height: `calc(100% - 60px)`, width: 500 }}>
          {props.queryBuilder}
          <Divider style={{ marginTop: '5px' }} />
          <Footer
            onSave={() => {
              props.onSave(form)
            }}
            onCancel={props.onCancel}
            onSearch={onSearch}
          />
        </Box>

        <Paper style={{ width: `calc(100% - 500px)`, height: '100%' }}>
          <Box style={{ width: '100%', height: '100%' }}>
            <Visualizations results={props.results || []} />
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

const AttributeDefinitionsContainer = (props: EditorProps) => {
  const { loading, error, attributeDefinitions } = useAttributeDefinitions()
  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} />
  }

  return (
    <SearchFormEditor {...props} attributeDefinitions={attributeDefinitions} />
  )
}

const useDummyExecutor = () => {
  const [results, setResults] = useState([])
  const onSearch = () => {
    setResults(genResults())
  }
  return { results, onSearch }
}

export default (props: any) => {
  const fn = useApolloFallback(useQueryExecutor, useDummyExecutor)
  const { results, onSearch } = fn()
  const Component = useApolloFallback(
    AttributeDefinitionsContainer,
    SearchFormEditor
  )

  //   <QueryBuilder
  //             attributeDefinitions={props.attributeDefinitions}
  //             form={searchForm}
  //             onChange={form => {
  //               setSearchForm(form)
  //             }}
  //           />
  return <Component {...props} results={results} onSearch={onSearch} />
}
