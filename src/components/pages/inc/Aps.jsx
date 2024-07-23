import React from 'react';
import { LazyLoadImage } from "react-lazy-load-image-component";
import logo from './../../images/photo-1594708767771-a7502209ff51.avif';
import './Aps.css'; // Import your custom CSS file

export const Aps = () => {
    return (
        <div className="">
            <div className='m-4 p-4 text-center'>
                <LazyLoadImage
                    effect="blur"
                    className="custom-image-width img-fluid rounded"
                    src={logo}
                    alt="Card image cap"
                />
            </div>
            <section className='p-2 bg-c-light border-top'>
                <div className='container'>
                    <h5 className='pt-5 main-heading text-center'>Education</h5>
                    <div className="underline mx-auto"></div>
                    <p className='p-2 text-center'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur ipsa hic rerum explicabo aspernatur tempora, aliquid cum nam, voluptas ad, dolorem totam porro perferendis? Ullam distinctio nesciunt tempore vitae consectetur?
                        Voluptates, consequuntur! Minus quidem, repudiandae sequi nemo et possimus, blanditiis vitae animi aspernatur culpa quas? Optio, quia. Illo sapiente corporis quia unde. Magnam eaque quam quas. Exercitationem doloremque dolores corrupti.
                        Officia vitae, impedit fuga natus quasi eveniet dolor. Beatae dolorem perspiciatis dolor eaque dolorum? Facilis soluta laudantium, dolor, nostrum fuga atque velit nesciunt cumque enim omnis ipsa hic nobis laboriosam.
                        Ullam eius repellat enim hic earum nostrum perspiciatis deleniti aut ut tenetur saepe, quo dicta, sunt ducimus est. Error, tempora. Illo saepe voluptatum optio tempora autem animi facere, sint ipsa.
                        Qui harum expedita iusto? Dolore accusamus suscipit nulla eius non aliquid inventore, consequatur est deleniti ex at autem dolores dolor temporibus voluptatibus facere illum veniam distinctio maxime iusto, aliquam dolorem?
                    </p>
                    <p className='p-2 text-center'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur ipsa hic rerum explicabo aspernatur tempora, aliquid cum nam, voluptas ad, dolorem totam porro perferendis? Ullam distinctio nesciunt tempore vitae consectetur?
                        Voluptates, consequuntur! Minus quidem, repudiandae sequi nemo et possimus, blanditiis vitae animi aspernatur culpa quas? Optio, quia. Illo sapiente corporis quia unde. Magnam eaque quam quas. Exercitationem doloremque dolores corrupti.
                        Officia vitae, impedit fuga natus quasi eveniet dolor. Beatae dolorem perspiciatis dolor eaque dolorum? Facilis soluta laudantium, dolor, nostrum fuga atque velit nesciunt cumque enim omnis ipsa hic nobis laboriosam.
                        Ullam eius repellat enim hic earum nostrum perspiciatis deleniti aut ut tenetur saepe, quo dicta, sunt ducimus est. Error, tempora. Illo saepe voluptatum optio tempora autem animi facere, sint ipsa.
                        Qui harum expedita iusto? Dolore accusamus suscipit nulla eius non aliquid inventore, consequatur est deleniti ex at autem dolores dolor temporibus voluptatibus facere illum veniam distinctio maxime iusto, aliquam dolorem?
                    </p>
                </div>
            </section>
            <section className='p-2 border-top'>
                <div className='container'>
                    <h5 className='pt-5 main-heading text-center'>Food</h5>
                    <div className="underline mx-auto"></div>
                    <p className='p-2 text-center'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur ipsa hic rerum explicabo aspernatur tempora, aliquid cum nam, voluptas ad, dolorem totam porro perferendis? Ullam distinctio nesciunt tempore vitae consectetur?
                        Voluptates, consequuntur! Minus quidem, repudiandae sequi nemo et possimus, blanditiis vitae animi aspernatur culpa quas? Optio, quia. Illo sapiente corporis quia unde. Magnam eaque quam quas. Exercitationem doloremque dolores corrupti.
                        Officia vitae, impedit fuga natus quasi eveniet dolor. Beatae dolorem perspiciatis dolor eaque dolorum? Facilis soluta laudantium, dolor, nostrum fuga atque velit nesciunt cumque enim omnis ipsa hic nobis laboriosam.
                        Ullam eius repellat enim hic earum nostrum perspiciatis deleniti aut ut tenetur saepe, quo dicta, sunt ducimus est. Error, tempora. Illo saepe voluptatum optio tempora autem animi facere, sint ipsa.
                        Qui harum expedita iusto? Dolore accusamus suscipit nulla eius non aliquid inventore, consequatur est deleniti ex at autem dolores dolor temporibus voluptatibus facere illum veniam distinctio maxime iusto, aliquam dolorem?
                    </p>
                    <p className='p-2 text-center'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur ipsa hic rerum explicabo aspernatur tempora, aliquid cum nam, voluptas ad, dolorem totam porro perferendis? Ullam distinctio nesciunt tempore vitae consectetur?
                        Voluptates, consequuntur! Minus quidem, repudiandae sequi nemo et possimus, blanditiis vitae animi aspernatur culpa quas? Optio, quia. Illo sapiente corporis quia unde. Magnam eaque quam quas. Exercitationem doloremque dolores corrupti.
                        Officia vitae, impedit fuga natus quasi eveniet dolor. Beatae dolorem perspiciatis dolor eaque dolorum? Facilis soluta laudantium, dolor, nostrum fuga atque velit nesciunt cumque enim omnis ipsa hic nobis laboriosam.
                        Ullam eius repellat enim hic earum nostrum perspiciatis deleniti aut ut tenetur saepe, quo dicta, sunt ducimus est. Error, tempora. Illo saepe voluptatum optio tempora autem animi facere, sint ipsa.
                        Qui harum expedita iusto? Dolore accusamus suscipit nulla eius non aliquid inventore, consequatur est deleniti ex at autem dolores dolor temporibus voluptatibus facere illum veniam distinctio maxime iusto, aliquam dolorem?
                    </p>
                </div>
            </section>
        </div>
    )
}
