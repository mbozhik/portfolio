import {client} from '@/lib/sanity'
import {Text} from '#/UI/Text'
import {WorkCard} from '@/components/UI/WorkCard'

export interface Work {
  name: string
  link?: string
  id: number
  description: string
  image: Array<{asset: {url: string}}>
  variant: string
  stack: Array<{value: string}>
  in_development: boolean
}

async function getData(): Promise<Work[]> {
  const data = await client.fetch<Work>(
    `*[_type == 'work'] {
        name,
        link,
        id,
        description,
        image,
        variant,
        stack,
        in_development,
    }`,
    {},
    {
      next: {
        revalidate: 30,
      },
    },
  )
  return Array.isArray(data) ? data : []
}

const Works = async () => {
  const works: Work[] = await getData()

  if (!works) {
    return <mark>Произошла ошибка при получении данных!</mark>
  }

  works.sort((a, b) => a.id - b.id)

  return (
    <section data-section="works-index" className="mt-8 space-y-8">
      <Text type="heading">my works</Text>

      <div className="flex flex-col gap-5 sm:gap-3">
        {works.map((work, index) => (
          <WorkCard work={work} index={index} key={index} />
        ))}
      </div>
    </section>
  )
}

export default Works