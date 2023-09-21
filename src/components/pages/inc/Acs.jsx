import React from 'react'
import { Pricing } from '../Pricing'
import { Registration } from './Registration'

export const Acs = () => {
    return (
        <div className="">
            <div className='container mt-3'>
                <h1 className="main-heading">Anddhen Consulting Services</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus facilis aliquam voluptates porro odit laborum iure alias ea neque, nisi debitis in deserunt adipisci dolorum, dolores voluptatem, doloremque maiores dicta commodi ut saepe? Esse ea ex qui, in ullam neque facere porro, quos dolorem sed nostrum ipsa ducimus deleniti fugit! Sint voluptatem maxime dolorum, animi saepe perferendis a, libero, officia voluptatum perspiciatis sit! Doloremque, voluptatibus ex eligendi, repellendus quaerat laudantium corporis, quas est natus nostrum ut possimus? Enim doloremque optio fuga nisi dicta maxime necessitatibus tenetur aperiam. Nobis ab quis, recusandae a qui eveniet quo molestiae ut vero nam quidem!</p>
                <Pricing />
                <div className="d-flex gap-3">
                    <div class="ratio ratio-16x9 w-25">
                        <iframe src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0" title="YouTube video" allowfullscreen></iframe>
                    </div>
                    <div class="ratio ratio-16x9 w-25">
                        <iframe src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0" title="YouTube video" allowfullscreen></iframe>
                    </div>
                </div>
                <Registration />
            </div>
        </div>
    )
}
