import ReadableCategory from '@/lib/readableCategory';

import { Search, CaretDownFill, CaretUpFill, HandThumbsUpFill, HandThumbsDownFill, StarFill } from 'react-bootstrap-icons';
import { useRouter } from 'next/router';
import { useState } from 'react';

const { InputGroup, Button, ButtonToolbar, Form , Dropdown, Col, Row} = require('react-bootstrap');

export default function SearchBar({ full, profile, defaultValue, defaultOrder, defaultCategory, label }) {
    const router =  useRouter()
    const [query, setQuery] = useState(defaultValue?defaultValue:"")
    const [order, setOrder] = useState(defaultOrder?defaultOrder:"relevant")
    const [category, setCategory] = useState(defaultCategory?defaultCategory:"any")

    const orderButtons = [
        {value: "relevant", shortText: "Relevance", fullText: "Most relevant", logo: <StarFill size={20} className='mx-1'/>},
        {value: "newest", shortText: "Newest", fullText: "Newest first", logo: <CaretUpFill size={20} className='mx-1'/>},
        {value: "oldest", shortText: "Oldest", fullText: "Oldest first", logo: <CaretDownFill size={20} className='mx-1'/>},
        {value: "liked", shortText: "Liked", fullText: "Most liked first", logo: <HandThumbsUpFill size={20} className='mx-1'/>},
        {value: "disliked", shortText: "Disliked", fullText: "Most disliked first", logo: <HandThumbsDownFill size={20} className='mx-1'/>},
    ]

    function find({ newOrder, newCategory }) {
        const quotedPattern = /"([a-z0-9 \-]+)"|'([a-z0-9 \-]+)'/gi
        const nonliteralPattern = /[^a-zA-z0-9 -]|(-\W)|\\/gi
        let formattedQuery = (query)?query.trim():""
        let q = []
    
        let quoted = formattedQuery.match(quotedPattern)
        if (quoted) {
            formattedQuery =  formattedQuery.replace(quotedPattern, "")
            quoted = quoted.map(element => element.slice(1,-1).trim().replace(nonliteralPattern, '').split(' ').filter(element => element).join(' <-> ')).filter(element => element).join(' & ')
            q.push(quoted)
        }
        
        let unquoted = formattedQuery.split(' ').map(element => element.trim().replace(nonliteralPattern, '').replace(/^-| -(?!$)/g, '!')).filter(element => element).join(' & ')
        if (unquoted) {
            q.push(unquoted)
        }
    
        formattedQuery = q.join(' & ')
    
        if (query.trim()) {
            if (profile) {
                router.push({
                    pathname: `/profile/search/${query.trim()}`,
                    query: {
                        Profile: profile.id, 
                        Search: formattedQuery,
                        Order: newOrder?newOrder:order,
                        Category: newCategory?newCategory:category
                    }
                })
            } else {
                router.push({
                    pathname: `/search/${query.trim()}`,
                    query: { 
                        Search: formattedQuery,
                        Order: newOrder?newOrder:order,
                        Category: newCategory?newCategory:category
                    }
                })
            }
            if (!full) {
                setQuery("")
            }
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        find({})
    }

    function CategoryControl() {
        if (full) {
            return(
                <Dropdown className='me-2'>
                    <Dropdown.Toggle>
                        <span className='align-text-top d-none d-lg-inline'>Category: </span>
                        <span className='align-text-top'>{(category === "any")?"Any":ReadableCategory(category)}</span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => {setCategory("any"); find({newCategory: "any"})}}>Any</Dropdown.Item>
                        <Dropdown.Item onClick={() => {setCategory("Movie"); find({newCategory: "Movie"})}}>Movie</Dropdown.Item>
                        <Dropdown.Item onClick={() => {setCategory("Book"); find({newCategory: "Book"})}}>Book</Dropdown.Item>
                        <Dropdown.Item onClick={() => {setCategory("VideoGame"); find({newCategory: "VideoGame"})}}>Video game</Dropdown.Item>
                        <Dropdown.Item onClick={() => {setCategory("TVSeries"); find({newCategory: "TVSeries"})}}>TV series</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            )
        }
    }

    function OrderControl() {
        if (full) {
            return(
                <Dropdown className='me-2'>
                    <Dropdown.Toggle>
                        <span className='align-text-top d-none d-lg-inline'>Order by:</span>
                        {orderButtons.find(element => element.value === order).logo}
                        <span className='align-text-top'>{orderButtons.find(element => element.value === order).shortText}</span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {orderButtons.map((element, id) => {
                            return(
                                <Dropdown.Item onClick={() => {setOrder(element.value); find({newOrder: element.value})}} key={id}>
                                    {element.logo}
                                    <span className='align-text-top'>{element.fullText}</span>
                                </Dropdown.Item>
                            )
                        })}
                    </Dropdown.Menu>
                </Dropdown>
            )
        }
    }
    
    if (full) {
        return(
            <Form className='my-1' onSubmit={handleSubmit}>
                <Row>
                    <InputGroup>
                        <Form.Control 
                            placeholder={label?label:'Search reviews'} 
                            value={query} 
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <Button variant='secondary' type='submit'>
                            <Search className='align-middle' />
                            <span className='align-text-top d-none d-lg-inline'> Search</span>
                        </Button>
                    </InputGroup>
                </Row>
                <Row className='mt-2'>
                    <ButtonToolbar>
                        <OrderControl />
                        <CategoryControl />
                    </ButtonToolbar>
                </Row>
            </Form>
        )
    }
    return(
        <Form className='my-1' onSubmit={handleSubmit}>
            <InputGroup>
                <Form.Control 
                    placeholder={label?label:'Search reviews'} 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Button variant='secondary' type='submit'><Search className='align-middle' /></Button>
            </InputGroup>
        </Form>
    )
}