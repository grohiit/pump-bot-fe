import { PumpLaunch } from '@/utils/types'

type Props = { pumpLaunch: PumpLaunch }

import Link from 'next/link'

export default function SingleLaunchRow({ pumpLaunch }: Props) {
  const timestamps = pumpLaunch.timestamps
  const fiveMinutes = timestamps.filter((t) => t > Date.now() - 5 * 60 * 1000)
  const oneHour = timestamps.filter((t) => t > Date.now() - 60 * 60 * 1000)
  const oneDay = timestamps.filter((t) => t > Date.now() - 24 * 60 * 60 * 1000)
  const sevenDays = timestamps.filter(
    (t) => t > Date.now() - 7 * 24 * 60 * 60 * 1000
  )

  const urlDisplay = pumpLaunch.url.replace(/https?:\/\//, '')
  let url = pumpLaunch.url

  // Ensure the URL starts with http or https
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url
  }

  return (
    <tr>
      <td className="line-clamp-1 overflow-scroll max-w-xs mx-auto ">
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-600"
        >
          {urlDisplay}
        </Link>
      </td>
      <td>{fiveMinutes.length}</td>
      <td>{oneHour.length}</td>
      <td>{oneDay.length}</td>
      <td>{sevenDays.length}</td>
      <td>{pumpLaunch.count}</td>
    </tr>
  )
}
