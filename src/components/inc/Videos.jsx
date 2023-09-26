import React from 'react'
import { videoLinks } from '../../dataconfig'

export const Videos = () => {
    console.log(videoLinks);
    return (
        <div>
            <div className='col-md-12 mb-4 text-center'>
                <h3 className='main-heading'>Videos</h3>
                <div className='underline mx-auto'></div>
            </div>
            <div class="row">
                {videoLinks.map((index, videoData) => (
                    <div key={index} className="col-12 col-lg-4 col-md-6 p-2">
                        <div class="card h-100">
                            <div class="ratio ratio-16x9">
                                <iframe src={videoLinks[videoData].link} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="allowfullscreen"></iframe>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">{videoLinks[videoData].title}</h5>
                                <p class="card-text">{videoLinks[videoData].description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
