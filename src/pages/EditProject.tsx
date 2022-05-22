import { Button, Container, Flex, Input, Text } from '@chakra-ui/react'
import { ArrowLeft } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'
import { api } from '../api/api'
import { useAuth } from '../contexts/authContext'
import Header from '../features/Header/Header'

import { ProjectType } from '../features/projectTable/dto/Project.dto'
import createFormData from '../utils/createFormData'

export default function EditProject() {
  const { handleSubmit, register, setValue } = useForm()

  const [submitingThumb, setsubmitingThumb] = useState(false)
  const [submitingGif, setsubmitingGif] = useState(false)
  const [submiting, setsubmiting] = useState(false)

  const { projectId } = useParams()

  const navigation = useNavigate()

  const { user, retrieveDataFromLocalStorage } = useAuth()

  async function onSubmitProjectFields(values: any) {
    setsubmiting(true)

    const projectData = createFormData(values)

    await api.put(`/projects/${projectId}`, projectData)
    setsubmiting(false)
  }

  async function onSubmitThumbnail(values: any) {
    setsubmitingThumb(true)

    const projectData = new FormData()

    projectData.append('thumbnail', values.thumbnail[0])

    await api.put(`/projects/${projectId}`, projectData)
    setsubmitingThumb(false)
  }

  async function onSubmitGif(values: any) {
    setsubmitingGif(true)

    const projectData = new FormData()

    projectData.append('gif', values.gif[0])

    await api.put(`/projects/${projectId}`, projectData)
    setsubmitingGif(false)
  }

  function handleGoBack() {
    navigation('/projects')
  }

  async function getProjectData() {
    const response = await api.get<ProjectType>(`/projects/${projectId}`)

    const keys = Object.keys(response.data) as Array<keyof typeof response.data>

    for (const key of keys) {
      if (key !== 'hidden' && key !== 'createdAt' && key !== 'updatedAt') {
        setValue(key, response.data[key])
      }
    }
  }

  useEffect(() => {
    if (user === null) {
      retrieveDataFromLocalStorage()
    }
  }, [user])

  useEffect(() => {
    getProjectData()
  }, [projectId])

  return (
    <>
      <Header />
      <Container maxW="container.xl">
        <Button margin="2rem 0" onClick={handleGoBack}>
          <ArrowLeft size={32} />
        </Button>

        <form onSubmit={handleSubmit(onSubmitProjectFields)}>
          <Flex flexDirection="column">
            <Text mb="4px">Nome do projeto</Text>
            <Input {...register('name')} />
          </Flex>

          <Flex flexDirection="column" mt="16px">
            <Text mb="4px">Descrição</Text>
            <Input {...register('description')} />
          </Flex>

          <Flex flexDirection="column" mt="16px">
            <Text mb="4px">Link do repositório</Text>
            <Input type="url" {...register('repoLink')} />
          </Flex>

          <Flex flexDirection="column" mt="16px">
            <Text mb="4px">Link do projeto</Text>
            <Input type="url" {...register('link')} />
          </Flex>

          <Flex flexDirection="column" mt="16px">
            <Text mb="4px">Link do favicon</Text>
            <Input type="url" {...register('faviconLink')} />
          </Flex>

          <Flex flexDirection="column" mt="16px">
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={submiting}
              type="submit"
            >
              Salvar projeto
            </Button>
          </Flex>
        </form>

        <form onSubmit={handleSubmit(onSubmitThumbnail)}>
          <Flex flexDirection="column" mt="16px">
            <Text mb="4px">Thumbnail</Text>
            <Input type="file" {...register('thumbnail')} />
          </Flex>

          <Flex flexDirection="column" mt="16px">
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={submitingThumb}
              type="submit"
            >
              Salvar thumbnail
            </Button>
          </Flex>
        </form>

        <form onSubmit={handleSubmit(onSubmitGif)}>
          <Flex flexDirection="column" mt="16px">
            <Text mb="4px">Gif</Text>
            <Input type="file" marginTop="4px" {...register('gif')} />
          </Flex>

          <Flex flexDirection="column" mt="16px">
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={submitingGif}
              type="submit"
            >
              Salvar gif
            </Button>
          </Flex>
        </form>
      </Container>
    </>
  )
}
