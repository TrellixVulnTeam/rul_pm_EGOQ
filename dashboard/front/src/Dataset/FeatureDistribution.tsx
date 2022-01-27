import { DatasetAPI as API } from './API'
import { ResponsiveLine } from '@nivo/line'
import React, { useEffect } from 'react'

import { isEmpty, zip } from '../utils'
import { CircularProgress } from '@mui/material'
interface FeatureDistributionProps {

    api: API;
    features: Array<string>
}
export default function FeatureDistribution(props: FeatureDistributionProps) {
    const [data, setData] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    let histograms = []
    const dataReady = (data) => {
        setData(data)
        setLoading(false)
    }
    useEffect(() => {
        
        props.api.featuresHistogram(props.features, dataReady)
     
    }, [props.features]);



    if (loading) {
        return <CircularProgress />
    }
    if (isEmpty(data)) {
        return null;
    }
    for (var feature in props.features) {
        if (!(props.features[feature] in data)) {
            continue;
        }
        const feature_data = data[props.features[feature]]

        for (var i = 0; i < feature_data.length; i++) {
            const bins = feature_data[i]['bins']
            const h_data = feature_data[i]['values']
            histograms.push(
                {
                    "id": 'Life ' + i,
                    "data": zip(bins, h_data).map((data, i) => {
                        return {
                            "x": data[0],
                            "y": data[1]
                        }
                    })
                }
            )
        }
    }


      return (
          <div  style={{height: '600px'}} >
           <ResponsiveLine
              enableArea={true}
               data={histograms}
               margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
               xScale={{ type: 'linear', max:'auto', min:'auto' }}
               yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false}}
               yFormat=" >-.2f"
               curve='monotoneX'
               enablePoints={false}
               axisTop={null}
               axisRight={null}
               axisBottom={{
                  
                   tickSize: 5,
                   tickPadding: 5,
                   tickRotation: 0,
                   legend: 'transportation',
                   legendOffset: 36,
                   legendPosition: 'middle'
               }}
               axisLeft={{
                   
                   tickSize: 5,
                   tickPadding: 5,
                   tickRotation: 0,
                   legend: 'count',
                   legendOffset: -40,
                   legendPosition: 'middle'
               }}
               pointSize={10}
               pointColor={{ theme: 'background' }}
               pointBorderWidth={2}
               pointBorderColor={{ from: 'serieColor' }}
               pointLabelYOffset={-12}
               useMesh={true}
               legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemBackground: 'rgba(0, 0, 0, .03)',
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}

           />
           </div>
       )
}