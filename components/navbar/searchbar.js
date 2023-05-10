import { Search, CaretDownFill, CaretUpFill, HandThumbsUpFill, HandThumbsDownFill, StarFill } from 'react-bootstrap-icons';
import { useRouter } from 'next/router';
import { useState } from 'react';

const { InputGroup, Button, ButtonToolbar, Form , Dropdown, Col} = require('react-bootstrap');

export default function SearchBar({ full, defaultValue, defaultOrder }) {
    const router =  useRouter()
    const [query, setQuery] = useState(defaultValue?defaultValue:"")
    const [order, setOrder] = useState(defaultOrder?defaultOrder:"relevant")

    const orderButtons = [
        {value: "relevant", shortText: "Relevance", fullText: "Most relevant", logo: <StarFill size={20} className='mx-1'/>},
        {value: "newest", shortText: "Newest", fullText: "Newest first", logo: <CaretUpFill size={20} className='mx-1'/>},
        {value: "oldest", shortText: "Oldest", fullText: "Oldest first", logo: <CaretDownFill size={20} className='mx-1'/>},
        {value: "liked", shortText: "Liked", fullText: "Most liked first", logo: <HandThumbsUpFill size={20} className='mx-1'/>},
        {value: "disliked", shortText: "Disliked", fullText: "Most disliked first", logo: <HandThumbsDownFill size={20} className='mx-1'/>},
    ]

    function find(newOrder) {
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
            router.push({
                pathname: `/search/${query.trim()}`,
                query: { 
                    Search: formattedQuery,
                    Order: newOrder?newOrder:order
                }
            })
            if (!full) {
                setQuery("")
            }
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        find()
    }

    function OrderControl() {
        if (full) {
            return(
                <>
                    <Dropdown className='me-2'>
                        <Dropdown.Toggle>
                            <span className='align-text-top d-none d-lg-inline'>Order by:</span>
                            {orderButtons.find(element => element.value === order).logo}
                            <span className='align-text-top'>{orderButtons.find(element => element.value === order).shortText}</span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {orderButtons.map((element, id) => {
                                return(
                                    <Dropdown.Item onClick={() => {setOrder(element.value); find(element.value)}} key={id}>
                                        {element.logo}
                                        <span className='align-text-top'>{element.fullText}</span>
                                    </Dropdown.Item>
                                )
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
                </>
            )
        }
    }
    
    if (full) {
        return(
            <Form className='my-1' onSubmit={handleSubmit}>
                <ButtonToolbar className='justify-content-start'>
                    <Col xs={8} lg={9} xl={10}>
                        <InputGroup>
                            <Form.Control 
                                placeholder='Search for reviews' 
                                value={query} 
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <Button variant='secondary' type='submit'>
                                <Search className='align-middle' />
                                <span className='align-text-top d-none d-lg-inline'> Search</span>
                            </Button>
                        </InputGroup>
                    </Col>
                    <Col xs={4} lg={3} xl={2}>
                        <OrderControl />
                    </Col>
                </ButtonToolbar>
            </Form>
        )
    }
    return(
        <Form className='my-1' onSubmit={handleSubmit}>
            <InputGroup>
                <Form.Control 
                    placeholder='Search for reviews' 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Button variant='secondary' type='submit'><Search className='align-middle' /></Button>
            </InputGroup>
        </Form>
    )
}